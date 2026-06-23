export class CarouselViewer {
  constructor(trackEl, options = {}) {
    this.track = trackEl;
    this.cards = [];
    this.currentIndex = 0;
    this.swapped = false;
    this.onIndexChange = options.onIndexChange || (() => {});
    this.flippedStates = new Map();
    this._boundKeyHandler = this._handleKey.bind(this);
    this._animating = false;
    this._slideEls = null;
    this._animTimer = null;
  }

  setCards(cards) {
    this.cards = cards;
    this.currentIndex = 0;
    this.flippedStates.clear();
    this._animating = false;
    this._clearAnimClasses();
    this._layoutSlides(false);
  }

  setSwapped(swapped) {
    this.swapped = swapped;
    this._layoutSlides(false);
  }

  getCurrentCard() {
    return this.cards[this.currentIndex] || null;
  }

  isCurrentFlipped() {
    return this.flippedStates.get(this.currentIndex) || false;
  }

  getCurrentDisplayText() {
    const card = this.getCurrentCard();
    if (!card) return "";
    return this.isCurrentFlipped() ? this.getBackText(card) : this.getFrontText(card);
  }

  getFrontText(card) {
    if (!card) return "";
    return this.swapped ? card.answer : card.question;
  }

  getBackText(card) {
    if (!card) return "";
    return this.swapped ? card.question : card.answer;
  }

  _ensureSlides() {
    if (this._slideEls) return;

    this.track.innerHTML = "";
    this._slideEls = ["left", "center", "right"].map((position) => {
      const slide = document.createElement("div");
      slide.className = `carousel-slide pos-${position}`;
      slide.dataset.position = position;

      const flipCard = document.createElement("div");
      flipCard.className = "flip-card";
      flipCard.innerHTML = `
        <div class="flip-card-inner">
          <div class="flip-card-front"></div>
          <div class="flip-card-back"></div>
        </div>
      `;
      slide.appendChild(flipCard);
      this.track.appendChild(slide);
      return slide;
    });
  }

  _visibleIndices() {
    const len = this.cards.length;
    if (len === 0) return [];
    if (len === 1) return [{ index: 0, position: "center" }];

    const prev = (this.currentIndex - 1 + len) % len;
    const next = (this.currentIndex + 1) % len;

    return [
      { index: prev, position: "left" },
      { index: this.currentIndex, position: "center" },
      { index: next, position: "right" }
    ];
  }

  _populateSlide(slide, cardIndex) {
    const card = this.cards[cardIndex];
    const flipCard = slide.querySelector(".flip-card");
    if (!card || !flipCard) return;

    const isFlipped = this.flippedStates.get(cardIndex) || false;
    flipCard.classList.toggle("flipped", isFlipped);
    flipCard.querySelector(".flip-card-front").textContent = this.getFrontText(card);
    flipCard.querySelector(".flip-card-back").textContent = this.getBackText(card);

    const position = slide.dataset.position;
    flipCard.onclick = null;
    slide.onclick = null;

    if (position === "center") {
      flipCard.onclick = (e) => {
        e.stopPropagation();
        this.flipCurrent();
      };
    } else if (position === "left") {
      slide.onclick = () => this.prev();
    } else if (position === "right") {
      slide.onclick = () => this.next();
    }
  }

  _layoutSlides(animate) {
    if (!this.cards.length) {
      this.track.innerHTML = "";
      this._slideEls = null;
      const empty = document.createElement("p");
      empty.className = "carousel-empty";
      empty.textContent = "No flashcards yet.";
      empty.style.textAlign = "center";
      empty.style.color = "#888";
      this.track.appendChild(empty);
      this.onIndexChange(0, 0);
      return;
    }

    this._ensureSlides();

    if (!animate) {
      this.track.classList.add("no-transition");
    }

    const slots = this._visibleIndices();
    const slotMap = { left: 0, center: 1, right: 2 };

    if (this.cards.length === 1) {
      this._slideEls.forEach((slide, i) => {
        slide.style.display = i === 1 ? "" : "none";
      });
      this._populateSlide(this._slideEls[1], 0);
    } else {
      this._slideEls.forEach((slide) => {
        slide.style.display = "";
      });
      slots.forEach(({ index, position }) => {
        this._populateSlide(this._slideEls[slotMap[position]], index);
      });
    }

    if (!animate) {
      requestAnimationFrame(() => {
        this.track.classList.remove("no-transition");
      });
    }

    this.onIndexChange(this.currentIndex + 1, this.cards.length);
  }

  _clearAnimClasses() {
    this.track.classList.remove("anim-next", "anim-prev", "is-animating");
    if (this._animTimer) {
      clearTimeout(this._animTimer);
      this._animTimer = null;
    }
  }

  _navigate(direction) {
    if (!this.cards.length || this._animating) return;
    if (this.cards.length === 1) return;

    this._animating = true;
    this.track.classList.add("is-animating");
    this.track.classList.add(direction > 0 ? "anim-next" : "anim-prev");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      this.track.classList.add("no-transition");
      this.track.classList.remove("anim-next", "anim-prev", "is-animating");

      this.currentIndex =
        (this.currentIndex + direction + this.cards.length) % this.cards.length;

      this._layoutSlides(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.track.classList.remove("no-transition");
          this._animating = false;
        });
      });
    };

    const onTransitionEnd = (e) => {
      if (!e.target.classList.contains("carousel-slide")) return;
      if (e.propertyName !== "transform") return;
      this.track.removeEventListener("transitionend", onTransitionEnd);
      if (this._animTimer) {
        clearTimeout(this._animTimer);
        this._animTimer = null;
      }
      finish();
    };

    this.track.addEventListener("transitionend", onTransitionEnd);
    this._animTimer = setTimeout(() => {
      this.track.removeEventListener("transitionend", onTransitionEnd);
      finish();
    }, 680);
  }

  render() {
    this._layoutSlides(false);
  }

  prev() {
    this._navigate(-1);
  }

  next() {
    this._navigate(1);
  }

  flipCurrent() {
    if (this._animating) return;
    const flipped = this.flippedStates.get(this.currentIndex) || false;
    this.flippedStates.set(this.currentIndex, !flipped);
    const centerSlide = this.track.querySelector('.carousel-slide[data-position="center"] .flip-card');
    if (centerSlide) centerSlide.classList.toggle("flipped");
  }

  resetFlip() {
    this.flippedStates.clear();
    this._layoutSlides(false);
  }

  enableKeyboard() {
    document.addEventListener("keydown", this._boundKeyHandler);
  }

  disableKeyboard() {
    document.removeEventListener("keydown", this._boundKeyHandler);
  }

  _handleKey(e) {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    if (e.code === "ArrowLeft") {
      e.preventDefault();
      this.prev();
    } else if (e.code === "ArrowRight") {
      e.preventDefault();
      this.next();
    } else if (e.code === "Space") {
      e.preventDefault();
      this.flipCurrent();
    }
  }
}

export function speakText(text, lang, cantonese = false) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const hasChinese = /[\u4e00-\u9fff]/.test(text);
  if (hasChinese) {
    utterance.lang = cantonese || lang === "yue-HK" ? "yue-HK" : lang || "zh-CN";
  } else {
    utterance.lang = lang || "en-US";
  }
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = utterance.lang.slice(0, 2);
  const preferred =
    (cantonese || utterance.lang === "yue-HK"
      ? voices.find((v) => v.lang === "yue-HK" || v.lang === "zh-HK")
      : null) ||
    voices.find((v) => v.lang.startsWith(langPrefix) && v.localService) ||
    voices.find((v) => v.lang.startsWith(langPrefix));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
