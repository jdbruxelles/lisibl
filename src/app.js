import { defaultTexts, locale } from "./i18n/index.js";

document.addEventListener("DOMContentLoaded", () => {
  let USE_BOLD = false;
  let USER_TEXTS = [];

  function boldWords(str) {
    const words = str.split(" ");
    const boldCharLength = 3;
    return words.map(word => {
      let x = /['’]/.test(word) ? 1 : 0;
      return `<b>${word.slice(0, boldCharLength + x)}</b>` +
        word.slice(boldCharLength + x);
    }).join(" ");
  }

  function escapeHTMLTags(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function updateContent() {
    const tensesArray = USER_TEXTS.length > 0 ? USER_TEXTS : defaultTexts;
    let resultAsHTML = "";
    for (let i = 0; i < tensesArray.length; i++) {
      const item = escapeHTMLTags(tensesArray[i]);
      if (item === "") continue;
      resultAsHTML += `<p>${USE_BOLD ? boldWords(item) : item}</p>`;
    }
    document.getElementById("result").innerHTML = resultAsHTML;
  }

  function validateUserText() {
    const inputValue = document.getElementById("custom-text").value.trim();
    if (inputValue === "") return;
    USER_TEXTS = inputValue.split("\n");
    updateContent();
  }

  // Initialization
  updateContent();

  document.querySelectorAll("input[name=typ]").forEach((input) => {
    input.addEventListener("change", () => {
      USE_BOLD = input.value === "bold";
      updateContent();
    });
  });

  document.getElementById("custom-text").oninput = function() {
    const validateBtn = document.getElementById("custom-text-validate");
    validateBtn.disabled = this.value.trim() === "";
  };

  document.getElementById("custom-text-toggle").onclick = () => {
    const container = document.getElementById("custom-text-section");
    container.style.display = container.style.display === "none" ? "block" : "none";
  };

  document.getElementById("custom-text-reset").onclick = () => {
    document.getElementById("custom-text").value = "";
    document.getElementById("custom-text-validate").disabled = true;
    USER_TEXTS = [];
    updateContent();
  };

  document.getElementById("custom-text-validate").onclick = validateUserText;
});
