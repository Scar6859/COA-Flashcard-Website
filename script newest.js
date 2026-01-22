const container = document.querySelector(".container");
const addQuestionCard = document.getElementById("add-question-card");
const cardButton = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-flashcard");
const closeBtn = document.getElementById("close-btn");
let editBool = false;
let editIndex = -1;

const flashcards = [];

const editQuestionCard = document.getElementById("edit-question-card");
const editQuestion = document.getElementById("edit-question");
const editAnswer = document.getElementById("edit-answer");
const editErrorMessage = document.getElementById("edit-error");
const editCloseBtn = document.getElementById("edit-close-btn");
const editSaveBtn = document.getElementById("edit-save-btn");

const translations = {
  en: {
    title: "Flashcard",
    addFlashcard: "Add Flashcard",
    addFlashcardTitle: "Add Flashcard",
    editFlashcardTitle: "Edit Flashcard",
    errorMsg: "Input fields cannot be empty!",
    labelQuestion: "Question:",
    labelAnswer: "Answer:",
    placeholderQuestion: "Type the question here...",
    placeholderAnswer: "Type the answer here...",
    saveBtn: "Save",
    showHide: "Show/Hide",
    chooseFilename: "Choose a filename for your set",
    saveFlashcards: "Save Flashcards",
    loadFlashcards: "Load Flashcards",
    createNewSet: "Create a new set"
  },
  zh: {
    title: "抽认卡",
    addFlashcard: "添加抽认卡",
    addFlashcardTitle: "添加抽认卡",
    editFlashcardTitle: "编辑抽认卡",
    errorMsg: "输入字段不能为空！",
    labelQuestion: "问题：",
    labelAnswer: "答案：",
    placeholderQuestion: "在此输入问题...",
    placeholderAnswer: "在此输入答案...",
    saveBtn: "保存",
    showHide: "显示/隐藏",
    chooseFilename: "为您的套装选择一个文件名",
    saveFlashcards: "保存抽认卡",
    loadFlashcards: "加载抽认卡",
    createNewSet: "创建新套装"
  }
};

let currentLang = "en";

function updateLanguage() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translations[currentLang][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.placeholder = translations[currentLang][key];
  });
  document.title = translations[currentLang].title;
  renderFlashcards();
}

const langToggle = document.getElementById("langToggle");
let isChinese = false;
langToggle.addEventListener("click", () => {
  isChinese = !isChinese;
  langToggle.classList.toggle("zh-active", isChinese);
  currentLang = isChinese ? "zh" : "en";
  updateLanguage();
});

addQuestion.addEventListener("click", () => {
  container.classList.add("hide");
  question.value = "";
  answer.value = "";
  addQuestionCard.classList.remove("hide");
});

closeBtn.addEventListener(
  "click",
  (hideQuestion = () => {
    container.classList.remove("hide");
    addQuestionCard.classList.add("hide");
    if (editBool) {
      editBool = false;
      submitQuestion();
    }
  })
);

cardButton.addEventListener(
  "click",
  (submitQuestion = () => {
    editBool = false;
    tempQuestion = question.value.trim();
    tempAnswer = answer.value.trim();
    if (!tempQuestion || !tempAnswer) {
      errorMessage.classList.remove("hide");
    } else {
      container.classList.remove("hide");
      addQuestionCard.classList.add("hide"); // Hide add popup on save
      errorMessage.classList.add("hide");
      if (editBool) {
        flashcards[editIndex].question = tempQuestion;
        flashcards[editIndex].answer = tempAnswer;
        editBool = false;
        editIndex = -1; // Reset edit index
        editQuestionCard.classList.add("hide"); // Hide edit popup on save
      } else {
        flashcards.push({ question: tempQuestion, answer: tempAnswer });
      }
      renderFlashcards();
      question.value = "";
      answer.value = "";
    }
  })
);

function renderFlashcards() {
  var listCard = document.getElementsByClassName("card-list-container");
  listCard[0].innerHTML = ""; // Clear existing cards before rendering

  flashcards.forEach((card, index) => {
    var div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML += `<p class="question-div">${card.question}</p>`;
    var displayAnswer = document.createElement("p");
    displayAnswer.classList.add("answer-div", "hide");
    displayAnswer.innerText = card.answer;

    var link = document.createElement("a");
    link.setAttribute("href", "#");
    link.setAttribute("class", "show-hide-btn");
    link.innerHTML = translations[currentLang].showHide;

    link.addEventListener("click", () => {
      displayAnswer.classList.toggle("hide");
    });

    var buttonsCon = document.createElement("div");
    buttonsCon.classList.add("buttons-con");
    var editButton = document.createElement("button");
    editButton.setAttribute("class", "edit");
    editButton.setAttribute("data-index", index); // Store index for editing
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    editButton.addEventListener("click", () => {
      editFlashcard(index);
    });
    var deleteButton = document.createElement("button");
    deleteButton.setAttribute("class", "delete");
    deleteButton.setAttribute("data-index", index); // Store index for deleting
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.addEventListener("click", () => {
      deleteFlashcard(index);
    });
    buttonsCon.appendChild(editButton);
    buttonsCon.appendChild(deleteButton);
    div.appendChild(link);
    div.appendChild(displayAnswer);
    div.appendChild(buttonsCon);
    listCard[0].appendChild(div);
  });
}

function deleteFlashcard(index) {
  flashcards.splice(index, 1);
  renderFlashcards(); // Re-render after deletion
}

function editFlashcard(index) {
  editBool = true;
  editIndex = index;
  addQuestionCard.classList.add("hide"); // Hide add popup
  editQuestionCard.classList.remove("hide"); // Show edit popup
  container.classList.add("hide");
  let card = flashcards[index];
  editQuestion.value = card.question;
  editAnswer.value = card.answer;
}

// Event listener for edit save button
editSaveBtn.addEventListener(
  "click",
  (submitEditQuestion = () => {
    tempQuestion = editQuestion.value.trim();
    tempAnswer = editAnswer.value.trim();
    if (!tempQuestion || !tempAnswer) {
      editErrorMessage.classList.remove("hide");
    } else {
      editQuestionCard.classList.add("hide"); // Hide edit popup
      container.classList.remove("hide");
      editErrorMessage.classList.add("hide");
      flashcards[editIndex].question = tempQuestion;
      flashcards[editIndex].answer = tempAnswer;
      renderFlashcards();
      editQuestion.value = "";
      editAnswer.value = "";
      editBool = false;
      editIndex = -1;
    }
  })
);

// Event listener for edit close button
editCloseBtn.addEventListener(
  "click",
  (hideEditQuestion = () => {
    editQuestionCard.classList.add("hide");
    container.classList.remove("hide");
    if (editBool) {
      editBool = false;
      // No need to call submitEditQuestion here, as it's for saving changes
    }
  })
);

// Initial render of flashcards (if any)
updateLanguage();

const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement.parentElement;
  let parentQuestion = parentDiv.querySelector(".question-div").innerText;
  if (edit) {
    let parentAns = parentDiv.querySelector(".answer-div").innerText;
    answer.value = parentAns;
    question.value = parentQuestion;
    disableButtons(true);
  }
  parentDiv.remove();
};

const disableButtons = (value) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = value;
  });
};

const localStorage = window.localStorage;

// Save Flashcards as JSON
document.getElementById("save-flashcards").addEventListener("click", () => {
  const filename = prompt(translations[currentLang].chooseFilename);
  if (filename === null) {
    // User cancelled the prompt
    return;
  }
  const finalFilename = filename.trim() === "" ? "flashcards.json" : `${filename.trim()}.json`;
  const json = JSON.stringify(flashcards, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = finalFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Create a new set
document.getElementById("create-new-set-btn").addEventListener("click", () => {
  flashcards.length = 0; // Clear all flashcards
  localStorage.removeItem("flashcards"); // Clear from localStorage
  renderFlashcards(); // Re-render to clear display
});

// Load Flashcards from JSON
document.getElementById("load-flashcards").addEventListener("click", () => {
  document.getElementById("load-flashcards-input").click();
});

document.getElementById("load-flashcards-input").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedFlashcards = JSON.parse(e.target.result);
        flashcards.length = 0; // Clear existing flashcards
        flashcards.push(...loadedFlashcards); // Add loaded flashcards
        renderFlashcards();
      } catch (e) {
        alert("Invalid JSON file.");
      } finally {
        event.target.value = ''; // Clear the file input to allow re-loading the same file
      }
    };
    reader.readAsText(file);
  }
});
// very newest code