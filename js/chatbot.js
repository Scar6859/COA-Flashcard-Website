const API_KEY_STORAGE = "coa_openai_api_key";
const CHAT_HISTORY_STORAGE = "coa_chat_history";

function hasChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function detectLang(text) {
  return hasChinese(text) ? "zh" : "en";
}

function withYue(response) {
  if (response.yue) return response;
  return { ...response, yue: response.zh };
}

const TUTOR_PATTERNS = [
  {
    match: /translate|翻译|翻譯|什么意思|meaning|means/i,
    respond: (msg) =>
      withYue({
        en: `I can help with translations! For "${msg}", try using a dictionary or flashcards. Common tip: Chinese characters often combine meanings — break them into parts.`,
        zh: `我可以帮你翻译！对于"${msg}"，建议使用词典或抽认卡。小贴士：汉字常由部件组合意义——试着拆分部首。`,
        yue: `我可以幫你翻譯！對於「${msg}」，建議用詞典或者閃卡。小貼士：漢字通常由部件組合意思——試下拆開部首。`
      })
  },
  {
    match: /grammar|语法|語法|sentence|句型|怎么.*说|點講/i,
    respond: () =>
      withYue({
        en: "Chinese grammar tip: Subject-Verb-Object order is similar to English, but time/place phrases usually come before the verb. Example: 我明天去北京.",
        zh: "中文语法小贴士：基本语序是主谓宾，与英文类似，但时间/地点通常放在动词前。例如：我明天去北京。",
        yue: "粵語語法小貼士：基本語序係主謂賓，同英文類似，但時間/地點通常放喺動詞前面。例如：我聽日去北京。"
      })
  },
  {
    match: /pronounc|发音|發音|tone|声调|聲調|pinyin|拼音|粵拼/i,
    respond: () =>
      withYue({
        en: "Mandarin has 4 tones + neutral tone. Cantonese has 6–9 tones depending on dialect. Tone changes meaning! Practice with the Speak button — use the 粵 toggle for Cantonese.",
        zh: "普通话有四个声调加轻声。声调改变意思！例如：mā（妈）、má（麻）、mǎ（马）、mà（骂）。可以用抽认卡上的朗读按钮练习。",
        yue: "廣東話有六至九個聲調（視乎方言）。聲調會改變意思！例如：媽、麻、馬、罵。可以用閃卡上面嘅朗讀掣練習，記得開啟「粵」掣。"
      })
  },
  {
    match: /hello|你好|hi|hey|早晨/i,
    respond: () =>
      withYue({
        en: "Hello! I'm your COA language assistant. I can help with Cantonese, Mandarin, and English vocabulary, grammar, and pronunciation.",
        zh: "你好！我是COA语言助手。我可以帮助学习中文词汇、短语、语法和发音。你想学什么？",
        yue: "你好！我係COA語言助手。我可以幫你學粵語、普通話同英文詞彙、片語、語法同發音。你想學咩？"
      })
  },
  {
    match: /help|帮助|幫助|怎么用|點用/i,
    respond: () =>
      withYue({
        en: "Here's how to use COA Flashcards:\n• Home → Make or View flashcard sets\n• Study mode: arrow keys to navigate, Space/click to flip\n• Swap Q/A, Speak button, and 粵 toggle for Cantonese TTS\n• Save/Load your custom sets as JSON files",
        zh: "COA抽认卡使用方法：\n• 首页 → 制作或查看抽认卡套装\n• 学习模式：方向键切换，空格/点击翻转\n• 交换问答、朗读按钮，粵语掣切换粤语朗读\n• 可将自定义套装保存/加载为JSON文件",
        yue: "COA閃卡使用方法：\n• 主頁 → 製作或者睇閃卡套裝\n• 學習模式：方向鍵切換，空格/撳卡翻转\n• 交換問答、朗讀掣，「粵」掣切換粵語朗讀\n• 可以將自訂套裝儲存/載入為JSON檔案"
      })
  }
];

function tutorResponse(message) {
  for (const pattern of TUTOR_PATTERNS) {
    if (pattern.match.test(message)) {
      return pattern.respond(message);
    }
  }
  const isZh = hasChinese(message);
  return withYue({
    en: isZh
      ? `Great question about "${message}"! Keep practicing with flashcards — repetition builds memory.`
      : `"${message}" — good topic! Use flashcards daily and practice out loud. Ask me about grammar, tones, or translations!`,
    zh: isZh
      ? `"${message}"——好问题！坚持用抽认卡练习，重复能加深记忆。`
      : `关于"${message}"的问题很好！学语言要每天用抽认卡、大声练习声调。`,
    yue: isZh
      ? `「${message}」——好問題！堅持用閃卡練習，重複可以加深記憶。`
      : `關於「${message}」嘅問題好好！學語言要每日用閃卡、大聲練習聲調。`
  });
}

async function callOpenAI(message, history, apiKey) {
  const systemPrompt = `You are a friendly Cantonese-Mandarin-English language tutor for the COA Flashcards app. 
Always respond with valid JSON only, no markdown: {"en":"English","zh":"Mandarin Chinese","yue":"Cantonese"}
All three fields must be filled. Help with vocabulary, grammar, pronunciation, and translations.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-10).flatMap((m) => [
      { role: m.role === "user" ? "user" : "assistant", content: m.en || m.zh || m.yue }
    ]),
    { role: "user", content: message }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 600
    })
  });

  if (!res.ok) throw new Error("API request failed");
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "";
  try {
    const parsed = JSON.parse(content);
    return withYue({
      en: parsed.en || content,
      zh: parsed.zh || content,
      yue: parsed.yue || parsed.zh || content
    });
  } catch {
    return withYue({ en: content, zh: content });
  }
}

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

  getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE) || "";
  }

  setApiKey(key) {
    if (key) localStorage.setItem(API_KEY_STORAGE, key);
    else localStorage.removeItem(API_KEY_STORAGE);
  }

  setChatLang(lang) {
    this.chatLang = lang;
    this.renderAll();
    this._backfillTranslations();
  }

  setCantoneseMode(enabled) {
    this.cantoneseMode = enabled;
    this.renderAll();
  }

  _getDisplayText(msg) {
    if (this.chatLang === "en") return msg.en || msg.zh || msg.yue || "";
    if (this.cantoneseMode) return msg.yue || msg.zh || msg.en || "";
    return msg.zh || msg.yue || msg.en || "";
  }

  _typingLabel() {
    if (this.chatLang === "en") return "Thinking...";
    return this.cantoneseMode ? "諗緊..." : "思考中...";
  }

  async _backfillTranslations() {
    let changed = false;
    for (const msg of this.messages) {
      if (!msg.yue) {
        msg.yue = msg.zh || msg.en;
        changed = true;
      }
      if (msg.en === msg.zh) {
        if (hasChinese(msg.zh)) {
          msg.en = await this._translateFallback(msg.zh, "en");
        } else {
          msg.zh = await this._translateFallback(msg.en, "zh");
        }
        changed = true;
      }
    }
    if (changed) {
      this._saveHistory();
      this.renderAll();
    }
  }

  _loadHistory() {
    // Chat is session-only so each device/browser starts fresh
    try {
      localStorage.removeItem(CHAT_HISTORY_STORAGE);
    } catch {
      /* ignore */
    }

    try {
      const saved = sessionStorage.getItem(CHAT_HISTORY_STORAGE);
      if (saved) this.messages = JSON.parse(saved);
    } catch {
      this.messages = [];
    }
    if (!this.messages.length) {
      this._setWelcomeMessage();
    }
    this.messages.forEach((m) => {
      if (!m.yue) m.yue = m.zh || m.en;
    });
  }

  _setWelcomeMessage() {
    this.messages = [
      {
        role: "assistant",
        en: "Hi! I'm your language assistant. Ask me about Chinese vocabulary, grammar, pronunciation, or translations!",
        zh: "你好！我是你的语言助手。可以问我中文词汇、语法、发音或翻译问题！",
        yue: "你好！我係你嘅語言助手。可以問我粵語詞彙、語法、發音或者翻譯問題！"
      }
    ];
  }

  _saveHistory() {
    try {
      sessionStorage.setItem(CHAT_HISTORY_STORAGE, JSON.stringify(this.messages));
    } catch {
      /* session full or unavailable */
    }
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

  _fillTranslationAsync(msg) {
    const sourceLang = detectLang(msg.en || msg.zh);
    const sourceText = sourceLang === "zh" ? msg.zh : msg.en;
    if (!sourceText) return;

    const targets =
      sourceLang === "zh"
        ? [
            ["en", "en"],
            ["yue", "yue"]
          ]
        : [
            ["zh", "zh"],
            ["yue", "yue"]
          ];

    Promise.all(
      targets.map(([field, lang]) =>
        this._translateFallback(sourceText, lang).then((translated) => {
          msg[field] = translated;
        })
      )
    )
      .then(() => {
        this._saveHistory();
        this.renderAll();
      })
      .catch(() => {});
  }

  async send() {
    const text = this.inputEl.value.trim();
    if (!text || this.loading) return;

    this.inputEl.value = "";
    this.loading = true;
    this.sendBtn.disabled = true;

    const userMsg = {
      role: "user",
      en: text,
      zh: text,
      yue: text
    };

    this.messages.push(userMsg);
    this._appendBubble(userMsg);
    this._saveHistory();
    this._fillTranslationAsync(userMsg);

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
        await new Promise((r) => setTimeout(r, 400));
        response = tutorResponse(text);
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
    } catch {
      typing.remove();
      const errMsg = withYue({
        role: "assistant",
        en: "Sorry, I couldn't process that. The built-in tutor is still available — try asking about grammar, tones, or translations!",
        zh: "抱歉，无法处理该请求。内置导师仍可使用——试试问语法、声调或翻译问题！",
        yue: "抱歉，處理唔到呢個請求。內置導師仍然用得——試下問語法、聲調或者翻譯問題！"
      });
      this.messages.push(errMsg);
      this._appendBubble(errMsg);
      this._saveHistory();
    } finally {
      this.loading = false;
      this.sendBtn.disabled = false;
      this.inputEl.focus();
    }
  }

  async _translateFallback(text, targetLang) {
    const apiKey = this.getApiKey();
    const langName =
      targetLang === "yue" ? "Cantonese" : targetLang === "zh" ? "Chinese" : "English";

    if (apiKey) {
      try {
        const res = await Promise.race([
          callOpenAI(`Translate to ${langName}: ${text}`, [], apiKey),
          new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000))
        ]);
        if (targetLang === "yue") return res.yue || res.zh;
        if (targetLang === "zh") return res.zh;
        return res.en;
      } catch {
        /* fall through */
      }
    }
    try {
      const langpair =
        targetLang === "zh" || targetLang === "yue" ? "en|zh-TW" : "zh-TW|en";
      const res = await Promise.race([
        fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`
        ),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000))
      ]);
      const data = await res.json();
      if (data.responseData?.translatedText) {
        return data.responseData.translatedText;
      }
    } catch {
      /* fall through */
    }
    return text;
  }

  refreshWelcome(welcomeEn, welcomeZh, welcomeYue) {
    if (this.messages.length === 1 && this.messages[0].role === "assistant") {
      this.messages[0].en = welcomeEn;
      this.messages[0].zh = welcomeZh;
      this.messages[0].yue = welcomeYue || welcomeZh;
      this.renderAll();
    }
  }
}
