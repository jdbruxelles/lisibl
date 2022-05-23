import { getUrlParam, removeUrlParam, escapeHTMLTags } from "./utils.js";
import {
  initI18n, updateI18n, getDefaultTexts,
  supportedLang, fallbackLang
} from "../../i18n/index.js";

// Saved settings:
// `fontSizeLvl`: font size level
// `hl`: selected lang (URL param or UI)

let locale, defaultTexts;

function updateDefaultTexts() {
  defaultTexts = getDefaultTexts(locale);
}

// Initialization
(function() {
  let savedLang = localStorage.getItem("hl") || "";
  let langInURL = getUrlParam("hl") || "";
  if (langInURL !== "" && Object.keys(supportedLang).includes(langInURL)) {
    locale = langInURL.substring(0, 2).toLowerCase();
    document.querySelector(".hlang .current-lang .lang-txt").innerText = locale;
  } else if (savedLang !== "") {
    locale = savedLang;
  } else {
    locale = window.navigator.language?.substring(0, 2) || fallbackLang;
  }

  let otherClasses, moreLangHTML = "";
  for (const lang in supportedLang) {
    otherClasses = locale === lang ? "selected" : "";
    moreLangHTML += `<div class="lang ${otherClasses}" data-value="${lang}">
      <span class="lang-txt">${lang}</span>
    </div>`;
  }

  document.querySelector(".hlang .current-lang .lang-txt").innerText = locale;
  document.querySelector(".hlang .more-lang").innerHTML = moreLangHTML;

  initI18n(locale);
  updateDefaultTexts();
})();

document.addEventListener("DOMContentLoaded", () => {
  let USE_BOLD = false;
  let USER_TEXTS = [];

  function updateFontSize(type, el, lvl) {
    if (!el) el = document.querySelector(".font-size-container .incr");
    const input = el.parentNode.querySelector(".font-size-container .value");
    const textContainer = document.getElementById("result");
    let fontSize = Number(textContainer.style.fontSize.split("px")[0]);
    let value;

    if (typeof lvl !== "undefined") {
      value = lvl;
      fontSize = fontSize + lvl;
    } else {
      value = Number(input.value);
      if (type === "+") {
        ++fontSize;
        ++value;
      } else if (type === "-") {
        --fontSize;
        --value;
      }
    }

    if (value < 0 || value > 10) {
      el.setAttribute("disabled", true);
    } else {
      input.value = value;
      textContainer.style.fontSize = `${fontSize}px`;
      el.parentNode.querySelector(".decr").removeAttribute("disabled");
      el.parentNode.querySelector(".incr").removeAttribute("disabled");
      if (typeof lvl === "undefined") localStorage.setItem("fontSizeLvl", value);
    }
  }

  function boldWords(str) {
    const words = str.split(" ");
    const boldCharLength = 3;
    return words.map(word => {
      let x = /['’]/.test(word) ? 1 : 0;
      return `<b>${word.slice(0, boldCharLength + x)}</b>` +
        word.slice(boldCharLength + x);
    }).join(" ");
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

  // Initializations
  updateFontSize("+", null, Number(localStorage.getItem("fontSizeLvl")) || 0);
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

  document.querySelectorAll(".hlang .current-lang, .hlang .more-lang").forEach((el) => {
    el.addEventListener("click", function() {
      if (this.parentNode.classList.contains("active")) {
        setTimeout(() => {
          this.parentNode.classList.remove("active");
        }, 100);
      } else {
        this.parentNode.classList.add("active");
      }
    });
  });

  document.querySelectorAll(".hlang .more-lang .lang").forEach((langBtn) => {
    langBtn.onclick = function() {
      this.classList.add("selected");
      this.parentNode.childNodes.forEach((el) => {
        el.classList.remove("selected");
      });

      locale = this.dataset.value;
      updateDefaultTexts();
      updateI18n(locale);
      updateContent();
      localStorage.setItem("hl", locale);
      if (getUrlParam("hl") != null) {
        removeUrlParam("hl");
      }

      document.querySelector(".hlang .current-lang .lang-txt").innerText = locale;
      document.querySelector(`.hlang .lang[data-value='${locale}']`)
        .classList.add("selected");
    };
  });

  document.querySelector(".font-size-container .incr").onclick = function() {
    updateFontSize("+", this);
  };

  document.querySelector(".font-size-container .decr").onclick = function() {
    updateFontSize("-", this);
  };
});
