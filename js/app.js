import { getLang, setLang, getCantonese, setCantonese, applyI18n, t, getSetDisplayName, SET_NAMES_YUE } from "./i18n.js";
import { CarouselViewer, speakText } from "./carousel.js";
import { Chatbot } from "./chatbot.js";
import { MakeFlashcards } from "./make.js";

const pages = {
  home: document.getElementById("page-home"),
  browse: document.getElementById("page-browse"),
  study: document.getElementById("page-study"),
  make: document.getElementById("page-make")
};

const backBtn = document.getElementById("back-btn");
const pageTitle = document.getElementById("page-title");
const chatSidebar = document.getElementById("chat-sidebar");
const appLayout = document.querySelector(".app-layout");
let currentPage = "home";
let catalog = [];
let currentSetId = null;
let studySwapped = false;

const studyCarousel = new CarouselViewer(document.getElementById("carousel-track"), {
  onIndexChange: (current, total) => {
    document.getElementById("card-counter").textContent = `${current} / ${total}`;
  }
});

const makeFlashcards = new MakeFlashcards(
  document.getElementById("make-list-container"),
  document.getElementById("make-carousel-track"),
  document.getElementById("make-card-counter")
);

const chatbot = new Chatbot(
  document.getElementById("chat-messages"),
  document.getElementById("chat-input"),
  document.getElementById("chat-send")
);

function navigate(page, titleKey) {
  currentPage = page;
  Object.entries(pages).forEach(([key, el]) => {
    el.classList.toggle("active", key === page);
  });

  const isHome = page === "home";
  backBtn.classList.toggle("hide", isHome);
  pageTitle.classList.toggle("hide", isHome);
  chatSidebar.classList.toggle("hide", isHome);
  appLayout.classList.toggle("no-chat", isHome);

  if (titleKey) {
    pageTitle.textContent = t(titleKey);
    pageTitle.classList.remove("hide");
  }

  studyCarousel.disableKeyboard();
  makeFlashcards.getCarousel().disableKeyboard();

  if (page === "study") {
    studyCarousel.enableKeyboard();
  } else if (page === "make" && makeFlashcards.viewMode === "study") {
    makeFlashcards.getCarousel().enableKeyboard();
  }
}

async function loadCatalog() {
  try {
    const res = await fetch("data/catalog.json");
    catalog = await res.json();
    catalog.forEach((set) => {
      set.nameYue = SET_NAMES_YUE[set.id] || set.nameZh;
    });
    renderCatalog();
  } catch (err) {
    console.error("Failed to load catalog", err);
  }
}

function renderCatalog() {
  const vocabGrid = document.getElementById("vocab-grid");
  const phrasesGrid = document.getElementById("phrases-grid");
  vocabGrid.innerHTML = "";
  phrasesGrid.innerHTML = "";

  catalog.forEach((set) => {
    const card = document.createElement("div");
    card.className = "set-card";
    const typeLabel = set.type === "vocab" ? t("typeVocab") : t("typePhrases");
    const name = getSetDisplayName(set);
    card.innerHTML = `
      <div class="set-type">${typeLabel}</div>
      <div class="set-name">${name}</div>
      <div class="set-count">50 ${t("cards")}</div>
    `;
    card.addEventListener("click", () => openSet(set));
    (set.type === "vocab" ? vocabGrid : phrasesGrid).appendChild(card);
  });
}

async function openSet(set) {
  try {
    const res = await fetch(set.file);
    const cards = await res.json();
    currentSetId = set.id;
    const name = getSetDisplayName(set);
    document.getElementById("study-set-name").textContent = name;
    studySwapped = false;
    document.getElementById("swap-btn").classList.remove("active");
    studyCarousel.setSwapped(false);
    studyCarousel.setCards(cards);
    studyCarousel.resetFlip();
    navigate("study", null);
    pageTitle.textContent = name;
    pageTitle.classList.remove("hide");
  } catch {
    alert("Could not load flashcard set.");
  }
}

function initUiLangToggle() {
  const toggle = document.getElementById("uiLangToggle");
  toggle.addEventListener("click", () => {
    const isZh = !toggle.classList.contains("zh-active");
    toggle.classList.toggle("zh-active", isZh);
    setLang(isZh ? "zh" : "en");
    applyI18n();
    renderCatalog();
    if (currentPage === "study" && currentSetId) {
      const activeSet = catalog.find((s) => s.id === currentSetId);
      if (activeSet) {
        const name = getSetDisplayName(activeSet);
        document.getElementById("study-set-name").textContent = name;
        pageTitle.textContent = name;
      }
    }
    makeFlashcards.render();
    chatbot.refreshWelcome(t("welcomeChatEn"), t("welcomeChatZh"), t("welcomeChatYue"));
  });
}

function initYueLangToggle() {
  const toggle = document.getElementById("yueLangToggle");
  toggle.addEventListener("click", () => {
    const isYue = !toggle.classList.contains("yue-active");
    toggle.classList.toggle("yue-active", isYue);
    setCantonese(isYue);
    chatbot.setCantoneseMode(isYue);
    applyI18n();
    renderCatalog();
    if (currentPage === "study" && currentSetId) {
      const activeSet = catalog.find((s) => s.id === currentSetId);
      if (activeSet) {
        const name = getSetDisplayName(activeSet);
        document.getElementById("study-set-name").textContent = name;
        pageTitle.textContent = name;
      }
    }
    makeFlashcards.render();
    chatbot.refreshWelcome(t("welcomeChatEn"), t("welcomeChatZh"), t("welcomeChatYue"));
  });
}

function initChatLangToggle() {
  const toggle = document.getElementById("chatLangToggle");
  toggle.addEventListener("click", () => {
    const isZh = !toggle.classList.contains("zh-active");
    toggle.classList.toggle("zh-active", isZh);
    chatbot.setChatLang(isZh ? "zh" : "en");
  });
}

function initNavigation() {
  document.getElementById("btn-make").addEventListener("click", () => {
    navigate("make", "makeFlashcards");
  });

  document.getElementById("btn-view").addEventListener("click", () => {
    navigate("browse", "browseTitle");
  });

  backBtn.addEventListener("click", () => {
    if (currentPage === "study") navigate("browse", "browseTitle");
    else navigate("home");
  });
}

function initStudyControls() {
  document.getElementById("carousel-prev").addEventListener("click", () => studyCarousel.prev());
  document.getElementById("carousel-next").addEventListener("click", () => studyCarousel.next());

  document.getElementById("swap-btn").addEventListener("click", () => {
    studySwapped = !studySwapped;
    document.getElementById("swap-btn").classList.toggle("active", studySwapped);
    studyCarousel.setSwapped(studySwapped);
    studyCarousel.resetFlip();
  });

  document.getElementById("tts-btn").addEventListener("click", () => {
    const text = studyCarousel.getCurrentDisplayText();
    if (!text) return;
    const hasChinese = /[\u4e00-\u9fff]/.test(text);
    const lang = hasChinese ? (getCantonese() ? "yue-HK" : "zh-CN") : "en-US";
    speakText(text, lang, getCantonese());
  });
}

function initMakeViewToggle() {
  const listBtn = document.getElementById("make-list-view");
  const studyBtn = document.getElementById("make-carousel-view");

  listBtn.addEventListener("click", () => {
    listBtn.classList.add("active");
    studyBtn.classList.remove("active");
    makeFlashcards.setViewMode("list");
  });

  studyBtn.addEventListener("click", () => {
    studyBtn.classList.add("active");
    listBtn.classList.remove("active");
    makeFlashcards.setViewMode("study");
  });

  document.getElementById("make-carousel-prev").addEventListener("click", () => {
    makeFlashcards.getCarousel().prev();
  });
  document.getElementById("make-carousel-next").addEventListener("click", () => {
    makeFlashcards.getCarousel().next();
  });
}

function initChatSettings() {
  const modal = document.getElementById("settings-modal");
  const input = document.getElementById("api-key-input");

  document.getElementById("chat-settings-btn").addEventListener("click", () => {
    input.value = chatbot.getApiKey();
    modal.classList.remove("hide");
  });

  document.getElementById("settings-close-btn").addEventListener("click", () => {
    modal.classList.add("hide");
  });

  document.getElementById("save-settings-btn").addEventListener("click", () => {
    chatbot.setApiKey(input.value.trim());
    modal.classList.add("hide");
  });
}

function init() {
  applyI18n();
  chatbot.renderAll();
  initUiLangToggle();
  initChatLangToggle();
  initYueLangToggle();
  initNavigation();
  initStudyControls();
  initMakeViewToggle();
  initChatSettings();
  loadCatalog();
  navigate("home");
}

init();
