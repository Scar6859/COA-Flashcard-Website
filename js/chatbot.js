const API_KEY_STORAGE = "coa_openai_api_key";
const CHAT_HISTORY_STORAGE = "coa_chat_history";

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function withYue(response) {
  if (response.yue) return response;
  return { ...response, yue: response.zh };
}

// ── AI back-ends ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a helpful AI assistant embedded in the COA Flashcards language-learning app.
Answer ANY question the user asks — language, culture, science, history, general knowledge, etc.
You have particular expertise in Cantonese, Mandarin, and English but you are not limited to those topics.
Always respond with valid JSON only (no markdown fences): {"en":"English response","zh":"Mandarin response","yue":"Cantonese response"}
All three fields must be present. Be concise: 2–4 sentences per language field.`;

async function callOpenAI(message, history, apiKey) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-10).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.en || m.zh || m.yue || ""
    })),
    { role: "user", content: message }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model: "gpt-4o-mini", messages, temperature: 0.7, max_tokens: 600 })
  });

  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  return parseAIResponse(data.choices?.[0]?.message?.content || "");
}

async function callPollinationsAI(message, history) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-8).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.en || m.zh || m.yue || ""
    })),
    { role: "user", content: message }
  ];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai", messages, private: true }),
      signal: controller.signal
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`Pollinations error: ${res.status}`);
    const data = await res.json();
    return parseAIResponse(data.choices?.[0]?.message?.content || "");
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

function parseAIResponse(content) {
  // Try to extract JSON even if the model wrapped it in markdown fences
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return withYue({
        en: parsed.en || content,
        zh: parsed.zh || content,
        yue: parsed.yue || parsed.zh || content
      });
    } catch { /* fall through */ }
  }
  return withYue({ en: content, zh: content });
}

// ── Offline fallback (no network / AI unavailable) ────────────

const OFFLINE_PATTERNS = [
  {
    match: /hello|你好|hi\b|hey\b|早晨/i,
    respond: () => withYue({
      en: "Hi! I'm your AI assistant. Ask me anything — language, culture, science, or whatever's on your mind!",
      zh: "你好！我是你的AI助手。可以问我任何问题——语言、文化、科学或者任何你想知道的！",
      yue: "你好！我係你嘅AI助手。可以問我任何問題——語言、文化、科學或者任何你想知嘅嘢！"
    })
  },
  {
    match: /help|帮助|幫助/i,
    respond: () => withYue({
      en: "I can help with language questions (Cantonese, Mandarin, English), general knowledge, culture, and more. Just ask!",
      zh: "我可以帮助解答语言问题（粤语、普通话、英语）、常识问题、文化知识等。尽管问！",
      yue: "我可以幫手解答語言問題（粵語、普通話、英語）、常識問題、文化知識等。儘管問！"
    })
  }
];

function offlineFallback(message) {
  for (const p of OFFLINE_PATTERNS) {
    if (p.match.test(message)) return p.respond();
  }
  return withYue({
    en: "I'm having trouble connecting to the AI right now. Please check your internet connection and try again.",
    zh: "目前连接AI时遇到问题，请检查网络连接后重试。",
    yue: "而家連接AI有啲問題，請檢查網絡連接之後再試。"
  });
}

// ── Chatbot class ────────────────────────────────────────────

export class Chatbot {
  constructor(messagesEl, inputEl, sendBtn) {
    this.messagesEl = messagesEl;
    this.inputEl = inputEl;
    this.sendBtn = sendBtn;
    this.chatLang = "en";
    this.cantoneseMode = false;
    this.messages = [];
    this.loading = false;

    this._loadHistory();
    sendBtn.addEventListener("click", () => this.send());
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });
  }

  getApiKey() { return localStorage.getItem(API_KEY_STORAGE) || ""; }

  setApiKey(key) {
    if (key) localStorage.setItem(API_KEY_STORAGE, key);
    else localStorage.removeItem(API_KEY_STORAGE);
  }

  setChatLang(lang) {
    this.chatLang = lang;
    this.renderAll();
  }

  setCantoneseMode(enabled) {
    this.cantoneseMode = enabled;
    this.renderAll();
  }

  _getDisplayText(msg) {
    if (this.chatLang === "en") return msg.en || msg.zh || msg.yue || "";
    if (this.cantoneseMode)      return msg.yue || msg.zh || msg.en || "";
    return msg.zh || msg.yue || msg.en || "";
  }

  _typingLabel() {
    if (this.chatLang === "en") return "Thinking…";
    return this.cantoneseMode ? "諗緊…" : "思考中…";
  }

  _loadHistory() {
    try { localStorage.removeItem(CHAT_HISTORY_STORAGE); } catch { /* ignore */ }
    try {
      const saved = sessionStorage.getItem(CHAT_HISTORY_STORAGE);
      if (saved) this.messages = JSON.parse(saved);
    } catch {
      this.messages = [];
    }
    if (!this.messages.length) this._setWelcomeMessage();
    this.messages.forEach((m) => { if (!m.yue) m.yue = m.zh || m.en; });
  }

  _setWelcomeMessage() {
    this.messages = [{
      role: "assistant",
      en: "Hi! I'm your AI assistant. Ask me anything — language help, translations, general knowledge, or whatever's on your mind!",
      zh: "你好！我是你的AI助手。可以问我任何问题——语言帮助、翻译、常识，或者任何想知道的！",
      yue: "你好！我係你嘅AI助手。可以問我任何問題——語言幫助、翻譯、常識，或者任何你想知嘅嘢！"
    }];
  }

  _saveHistory() {
    try { sessionStorage.setItem(CHAT_HISTORY_STORAGE, JSON.stringify(this.messages)); } catch { /* full */ }
  }

  renderAll() {
    this.messagesEl.innerHTML = "";
    this.messages.forEach((msg) => this._appendBubble(msg, false));
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  _appendBubble(msg, scroll = true) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${msg.role}`;
    bubble.textContent = this._getDisplayText(msg);
    this.messagesEl.appendChild(bubble);
    if (scroll) this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    return bubble;
  }

  async send() {
    const text = this.inputEl.value.trim();
    if (!text || this.loading) return;

    this.inputEl.value = "";
    this.loading = true;
    this.sendBtn.disabled = true;

    const userMsg = { role: "user", en: text, zh: text, yue: text };
    this.messages.push(userMsg);
    this._appendBubble(userMsg);
    this._saveHistory();

    const typing = document.createElement("div");
    typing.className = "chat-bubble assistant typing";
    typing.textContent = this._typingLabel();
    this.messagesEl.appendChild(typing);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;

    try {
      const apiKey = this.getApiKey();
      let response;

      if (apiKey) {
        response = await callOpenAI(text, this.messages.slice(0, -1), apiKey);
      } else {
        try {
          response = await callPollinationsAI(text, this.messages.slice(0, -1));
        } catch {
          response = offlineFallback(text);
        }
      }

      typing.remove();
      const assistantMsg = {
        role: "assistant",
        en: response.en,
        zh: response.zh,
        yue: response.yue || response.zh
      };
      this.messages.push(assistantMsg);
      this._appendBubble(assistantMsg);
      this._saveHistory();
    } catch (err) {
      typing.remove();
      const errMsg = {
        role: "assistant",
        en: "Sorry, something went wrong. Please try again.",
        zh: "抱歉，出现了问题，请重试。",
        yue: "抱歉，出現咗問題，請再試。"
      };
      this.messages.push(errMsg);
      this._appendBubble(errMsg);
      this._saveHistory();
    } finally {
      this.loading = false;
      this.sendBtn.disabled = false;
      this.inputEl.focus();
    }
  }

  refreshWelcome(welcomeEn, welcomeZh, welcomeYue) {
    if (this.messages.length === 1 && this.messages[0].role === "assistant") {
      this.messages[0].en = welcomeEn || this.messages[0].en;
      this.messages[0].zh = welcomeZh || this.messages[0].zh;
      this.messages[0].yue = welcomeYue || welcomeZh || this.messages[0].yue;
      this.renderAll();
    }
  }
}
