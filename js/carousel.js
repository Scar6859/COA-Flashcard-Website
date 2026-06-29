// relPos 0=center, 1=right, 2=extra-right(off), 3=extra-left(off), 4=left
const POSITIONS = ['pos-center', 'pos-right', 'pos-extra-right', 'pos-extra-left', 'pos-left'];
const CARD_OFFSETS = [0, 1, 2, -2, -1];

export class CarouselViewer {
  constructor(trackEl, options = {}) {
    this.track = trackEl;
    this.cards = [];
    this.currentIndex = 0;
    this.centerSlot = 2; // which of the 5 DOM slots is currently "center"
    this.swapped = false;
    this.onIndexChange = options.onIndexChange || (() => {});
    this.flippedStates = new Map();
    this._boundKeyHandler = this._handleKey.bind(this);
    this._animating = false;
    this._slideEls = null;
    this._animTimer = null;
    this._touchStartX = 0;
    this._boundTouchStart = this._onTouchStart.bind(this);
    this._boundTouchEnd = this._onTouchEnd.bind(this);
    this.track.addEventListener('touchstart', this._boundTouchStart, { passive: true });
    this.track.addEventListener('touchend', this._boundTouchEnd, { passive: true });
  }

  // ── Public API ───────────────────────────────────────────────

  setCards(cards) {
    this.cards = cards;
    this.currentIndex = 0;
    this.centerSlot = 2;
    this.flippedStates.clear();
    this._animating = false;
    if (this._animTimer) { clearTimeout(this._animTimer); this._animTimer = null; }
    this._buildLayout();
  }

  setSwapped(swapped) {
    this.swapped = swapped;
    this._refreshAllContent();
  }

  getCurrentCard() {
    return this.cards[this.currentIndex] || null;
  }

  isCurrentFlipped() {
    return this.flippedStates.get(this.currentIndex) || false;
  }

  getCurrentDisplayText() {
    const card = this.getCurrentCard();
    if (!card) return '';
    return this.isCurrentFlipped() ? this.getBackText(card) : this.getFrontText(card);
  }

  getFrontText(card) {
    if (!card) return '';
    return this.swapped ? card.answer : card.question;
  }

  getBackText(card) {
    if (!card) return '';
    return this.swapped ? card.question : card.answer;
  }

  render() { this._buildLayout(); }
  prev()   { this._navigate(-1); }
  next()   { this._navigate(1); }

  flipCurrent() {
    if (this._animating) return;
    const flipped = this.flippedStates.get(this.currentIndex) || false;
    this.flippedStates.set(this.currentIndex, !flipped);
    const centerSlide = this._slideEls && this._slideEls[this.centerSlot];
    if (centerSlide) centerSlide.querySelector('.flip-card').classList.toggle('flipped');
  }

  resetFlip() {
    this.flippedStates.clear();
    this._refreshAllContent();
  }

  enableKeyboard() {
    document.addEventListener('keydown', this._boundKeyHandler);
  }

  disableKeyboard() {
    document.removeEventListener('keydown', this._boundKeyHandler);
  }

  // ── Private helpers ──────────────────────────────────────────

  _relPos(slotIndex) {
    return (slotIndex - this.centerSlot + 5) % 5;
  }

  _cardIndexForSlot(slotIndex) {
    const n = this.cards.length;
    if (!n) return 0;
    const offset = CARD_OFFSETS[this._relPos(slotIndex)];
    return ((this.currentIndex + offset) % n + n) % n;
  }

  _ensureSlides() {
    if (this._slideEls) return;
    this.track.innerHTML = '';
    this._slideEls = Array.from({ length: 5 }, (_, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.dataset.slot = i;
      slide.innerHTML = `
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front"></div>
            <div class="flip-card-back"></div>
          </div>
        </div>`;
      this.track.appendChild(slide);
      return slide;
    });
  }

  _setSlideContent(slideEl, cardIndex) {
    const card = this.cards[cardIndex];
    if (!card) return;
    const flipCard = slideEl.querySelector('.flip-card');
    flipCard.classList.toggle('flipped', this.flippedStates.get(cardIndex) || false);
    flipCard.querySelector('.flip-card-front').textContent = this.getFrontText(card);
    flipCard.querySelector('.flip-card-back').textContent = this.getBackText(card);
  }

  _setSlideHandlers(slotIndex) {
    const slide = this._slideEls[slotIndex];
    const flipCard = slide.querySelector('.flip-card');
    flipCard.onclick = null;
    slide.onclick = null;
    const relPos = this._relPos(slotIndex);
    if (relPos === 0) {
      flipCard.onclick = (e) => { e.stopPropagation(); this.flipCurrent(); };
    } else if (relPos === 4) {
      slide.onclick = () => this.prev();
    } else if (relPos === 1) {
      slide.onclick = () => this.next();
    }
  }

  _buildLayout() {
    if (!this.cards.length) {
      this.track.innerHTML = '';
      this._slideEls = null;
      const empty = document.createElement('p');
      empty.className = 'carousel-empty';
      empty.textContent = 'No flashcards yet.';
      empty.style.cssText = 'text-align:center;color:#888;';
      this.track.appendChild(empty);
      this.onIndexChange(0, 0);
      return;
    }

    this._ensureSlides();

    // Instantly set all 5 slots to their correct positions and content
    this._slideEls.forEach(s => s.classList.add('no-transition'));
    for (let i = 0; i < 5; i++) {
      const slide = this._slideEls[i];
      POSITIONS.forEach(p => slide.classList.remove(p));
      slide.classList.add(POSITIONS[this._relPos(i)]);
      this._setSlideContent(slide, this._cardIndexForSlot(i));
      this._setSlideHandlers(i);
    }
    requestAnimationFrame(() => {
      if (this._slideEls) this._slideEls.forEach(s => s.classList.remove('no-transition'));
    });

    this.onIndexChange(this.currentIndex + 1, this.cards.length);
  }

  _refreshAllContent() {
    if (!this._slideEls) return;
    for (let i = 0; i < 5; i++) {
      this._setSlideContent(this._slideEls[i], this._cardIndexForSlot(i));
    }
  }

  // ── Navigation ───────────────────────────────────────────────

  _navigate(direction) {
    if (!this.cards.length || this._animating) return;
    const n = this.cards.length;
    if (n <= 1) return;

    this._animating = true;
    this.track.classList.add('is-animating');

    const newIndex = ((this.currentIndex + direction) % n + n) % n;
    const newCenterSlot = ((this.centerSlot + direction) % 5 + 5) % 5;

    // The "recycled" slot jumps invisibly from one off-screen side to the other.
    // For NEXT: old extra-left (relPos 3) → new extra-right (relPos 2)
    // For PREV: old extra-right (relPos 2) → new extra-left (relPos 3)
    const recycleSlot = direction > 0
      ? (this.centerSlot + 3) % 5
      : (this.centerSlot + 2) % 5;
    const recycleNewRelPos = direction > 0 ? 2 : 3; // pos-extra-right or pos-extra-left
    const recycleCardIndex = direction > 0
      ? ((newIndex + 2) % n + n) % n
      : ((newIndex - 2) % n + n) % n;

    // Step 1: Instantly reposition + repopulate the recycled (off-screen) slot.
    // Both old and new positions are opacity-0, so no flash occurs.
    const recycleEl = this._slideEls[recycleSlot];
    recycleEl.classList.add('no-transition');
    POSITIONS.forEach(p => recycleEl.classList.remove(p));
    recycleEl.classList.add(POSITIONS[recycleNewRelPos]);
    this._setSlideContent(recycleEl, recycleCardIndex);
    void recycleEl.offsetWidth; // force reflow before re-enabling transition
    recycleEl.classList.remove('no-transition');

    // Step 2: Advance centerSlot, then animate all other slides to their new positions
    // by swapping CSS classes — the transition does all the visual work.
    this.centerSlot = newCenterSlot;
    for (let i = 0; i < 5; i++) {
      if (i === recycleSlot) continue;
      const slide = this._slideEls[i];
      POSITIONS.forEach(p => slide.classList.remove(p));
      slide.classList.add(POSITIONS[this._relPos(i)]);
    }

    // Step 3: After transition completes, commit new index and refresh handlers.
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (this._animTimer) { clearTimeout(this._animTimer); this._animTimer = null; }
      this.track.classList.remove('is-animating');
      this.currentIndex = newIndex;
      for (let i = 0; i < 5; i++) this._setSlideHandlers(i);
      this._animating = false;
      this.onIndexChange(this.currentIndex + 1, this.cards.length);
    };

    const onTransEnd = (e) => {
      if (!e.target.classList.contains('carousel-slide')) return;
      if (e.propertyName !== 'transform') return;
      this.track.removeEventListener('transitionend', onTransEnd);
      finish();
    };
    this.track.addEventListener('transitionend', onTransEnd);
    this._animTimer = setTimeout(() => {
      this.track.removeEventListener('transitionend', onTransEnd);
      finish();
    }, 680);
  }

  // ── Input handlers ───────────────────────────────────────────

  _handleKey(e) {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    if (e.code === 'ArrowLeft')       { e.preventDefault(); this.prev(); }
    else if (e.code === 'ArrowRight') { e.preventDefault(); this.next(); }
    else if (e.code === 'Space')      { e.preventDefault(); this.flipCurrent(); }
  }

  _onTouchStart(e) {
    this._touchStartX = e.changedTouches[0].clientX;
  }

  _onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - this._touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? this.next() : this.prev();
    }
  }
}

export function speakText(text, lang, cantonese = false) {
  if (!text || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const hasChinese = /[\u4e00-\u9fff]/.test(text);
  if (hasChinese) {
    utterance.lang = cantonese || lang === 'yue-HK' ? 'yue-HK' : lang || 'zh-CN';
  } else {
    utterance.lang = lang || 'en-US';
  }
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = utterance.lang.slice(0, 2);
  const preferred =
    (cantonese || utterance.lang === 'yue-HK'
      ? voices.find(v => v.lang === 'yue-HK' || v.lang === 'zh-HK')
      : null) ||
    voices.find(v => v.lang.startsWith(langPrefix) && v.localService) ||
    voices.find(v => v.lang.startsWith(langPrefix));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}
