import { t } from "./i18n.js";
import { CarouselViewer } from "./carousel.js";

export class MakeFlashcards {
  constructor(listContainer, carouselTrack, counterEl) {
    this.flashcards = [];
    this.editIndex = -1;
    this.listContainer = listContainer;
    this.counterEl = counterEl;
    this.viewMode = "list";

    this.carousel = new CarouselViewer(carouselTrack, {
      onIndexChange: (current, total) => {
        if (counterEl) counterEl.textContent = `${current} / ${total}`;
      }
    });

    this._bindModals();
    this._bindFileOps();
  }

  _bindModals() {
    const addModal = document.getElementById("add-modal");
    const editModal = document.getElementById("edit-modal");

    document.getElementById("add-flashcard").addEventListener("click", () => {
      document.getElementById("question").value = "";
      document.getElementById("answer").value = "";
      document.getElementById("add-error").classList.add("hide");
      addModal.classList.remove("hide");
    });

    document.getElementById("close-add-btn").addEventListener("click", () => {
      addModal.classList.add("hide");
    });

    document.getElementById("save-btn").addEventListener("click", () => {
      const q = document.getElementById("question").value.trim();
      const a = document.getElementById("answer").value.trim();
      if (!q || !a) {
        document.getElementById("add-error").classList.remove("hide");
        return;
      }
      this.flashcards.push({ question: q, answer: a });
      addModal.classList.add("hide");
      this.render();
    });

    document.getElementById("edit-close-btn").addEventListener("click", () => {
      editModal.classList.add("hide");
      this.editIndex = -1;
    });

    document.getElementById("edit-save-btn").addEventListener("click", () => {
      const q = document.getElementById("edit-question").value.trim();
      const a = document.getElementById("edit-answer").value.trim();
      if (!q || !a) {
        document.getElementById("edit-error").classList.remove("hide");
        return;
      }
      if (this.editIndex >= 0) {
        this.flashcards[this.editIndex] = { question: q, answer: a };
      }
      editModal.classList.add("hide");
      this.editIndex = -1;
      this.render();
    });
  }

  _bindFileOps() {
    document.getElementById("save-flashcards").addEventListener("click", () => {
      const filename = prompt(t("chooseFilename"));
      if (filename === null) return;
      const finalName = filename.trim() === "" ? "flashcards.json" : `${filename.trim()}.json`;
      const blob = new Blob([JSON.stringify(this.flashcards, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = finalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    document.getElementById("load-flashcards").addEventListener("click", () => {
      document.getElementById("load-flashcards-input").click();
    });

    document.getElementById("load-flashcards-input").addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loaded = JSON.parse(e.target.result);
          if (!Array.isArray(loaded)) throw new Error("Invalid format");
          this.flashcards = loaded.map((c) => ({
            question: String(c.question || ""),
            answer: String(c.answer || "")
          }));
          this.render();
        } catch {
          alert(t("invalidJson"));
        } finally {
          event.target.value = "";
        }
      };
      reader.readAsText(file);
    });

    document.getElementById("create-new-set-btn").addEventListener("click", () => {
      if (confirm(t("confirmNewSet"))) {
        this.flashcards = [];
        this.render();
      }
    });
  }

  setViewMode(mode) {
    this.viewMode = mode;
    const listEl = document.getElementById("make-list-container");
    const carouselWrap = document.getElementById("make-carousel-wrap");
    if (mode === "list") {
      listEl.classList.remove("hide");
      carouselWrap.classList.add("hide");
      this.carousel.disableKeyboard();
    } else {
      listEl.classList.add("hide");
      carouselWrap.classList.remove("hide");
      this.carousel.setCards(this.flashcards);
      this.carousel.enableKeyboard();
    }
  }

  render() {
    this._renderList();
    if (this.viewMode === "study") {
      this.carousel.setCards(this.flashcards);
    }
  }

  _renderList() {
    this.listContainer.innerHTML = "";
    this.flashcards.forEach((card, index) => {
      const div = document.createElement("div");
      div.className = "list-card";

      const qDiv = document.createElement("p");
      qDiv.className = "question-div";
      qDiv.textContent = card.question;

      const aDiv = document.createElement("p");
      aDiv.className = "answer-div hide-answer";
      aDiv.textContent = card.answer;

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "show-hide-btn";
      toggleBtn.textContent = t("showHide");
      toggleBtn.addEventListener("click", () => {
        aDiv.classList.toggle("hide-answer");
      });

      const buttonsCon = document.createElement("div");
      buttonsCon.className = "buttons-con";

      const editBtn = document.createElement("button");
      editBtn.className = "edit";
      editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
      editBtn.addEventListener("click", () => this._edit(index));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete";
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
      deleteBtn.addEventListener("click", () => {
        this.flashcards.splice(index, 1);
        this.render();
      });

      buttonsCon.appendChild(editBtn);
      buttonsCon.appendChild(deleteBtn);
      div.appendChild(qDiv);
      div.appendChild(toggleBtn);
      div.appendChild(aDiv);
      div.appendChild(buttonsCon);
      this.listContainer.appendChild(div);
    });
  }

  _edit(index) {
    this.editIndex = index;
    const card = this.flashcards[index];
    document.getElementById("edit-question").value = card.question;
    document.getElementById("edit-answer").value = card.answer;
    document.getElementById("edit-error").classList.add("hide");
    document.getElementById("edit-modal").classList.remove("hide");
  }

  getCarousel() {
    return this.carousel;
  }
}
