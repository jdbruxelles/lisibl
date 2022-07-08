import en from "../../i18n/en.json" assert {type: "json"};
import fr from "../../i18n/fr.json" assert {type: "json"};
import { $, $$, escapeHTMLTags } from "./utils.js";
import si18n from "https://cdn.jsdelivr.net/npm/si18n.js@1.1.0/si18n.js";

// Saved settings:
// `fontSizeLvl`: font size level
// `hl`: selected lang (URL param or UI) by si18n.js

document.addEventListener("DOMContentLoaded", () => {
  let USE_BOLD = false;
  let USER_TEXTS = [];

  function updateFontSize(type, el, lvl) {
    if (!el) el = $(".font-size-container .incr");
    const input = el.parentNode.querySelector(".font-size-container .value");
    const textContainer = $("#result");
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
    return words.map(word => {
      let boldCharLength = 3;
      if (/['’-]/.test(word)) boldCharLength++;
      if (word.length / boldCharLength >= 3) boldCharLength++;
      // if (!/^[a-zA-Z0-9]/.test(word)) return word;
      return `<b>${word.slice(0, boldCharLength)}</b>` +
        word.slice(boldCharLength);
    }).join(" ");
  }

  function updateContent() {
    const tensesArray = USER_TEXTS.length > 0 ? USER_TEXTS : getDefaultTexts();
    let resultAsHTML = "";
    for (let i = 0; i < tensesArray.length; i++) {
      const item = escapeHTMLTags(tensesArray[i]);
      if (item === "") continue;
      resultAsHTML += `<p>${USE_BOLD ? boldWords(item) : item}</p>`;
    }
    $("#result").innerHTML = resultAsHTML;
  }

  function validateUserText() {
    const inputValue = $("#custom-text").value.trim();
    if (inputValue === "") return;
    USER_TEXTS = inputValue.split("\n");
    updateContent();
  }

  const getDefaultTexts = (langCode = si18nObj.getLocale()) => {
    const samples = si18nObj.toJSON().locales[langCode].samples;
    let defaultTexts = [];

    for (const key in samples) {
      if (Object.hasOwnProperty.call(samples, key))
        defaultTexts.push(samples[key]);
    }

    return defaultTexts;
  };

  const si18nObj = new si18n();
  si18nObj.init({
    locales: { en, fr },
    lang: "fr",
    saveAs: "hl",
    fallbackLang: "fr",
    translate() {
      let moreLangHTML = "";
      let locale = si18nObj.getLocale();
      let siteDescription = si18nObj.t("site.description")
        .replace("$t(site.title)", si18nObj.t("site.title"));

      $$("meta[property='og:description']," +
        " meta[property='twitter:description'], meta[name='description']").forEach((metaEl) => {
        metaEl.content = siteDescription;
      });
      $(".site-description").innerText = siteDescription;

      for (const lang of si18nObj.getLocales()) {
        const otherClasses = locale === lang ? "selected" : "x";
        moreLangHTML += `<div class="lang ${otherClasses}" data-value="${lang}">
          <span class="lang-txt">${lang}</span>
        </div>`;
      }

      $(".hlang .current-lang .lang-txt").innerText = locale;
      $(".hlang .more-lang").innerHTML = moreLangHTML;
      $("#custom-text").placeholder = si18nObj.t("options.pasteTextHere");

      document.querySelectorAll(".hlang .more-lang .lang").forEach((langBtn) => {
        langBtn.onclick = function() {
          this.classList.add("selected");
          this.parentNode.childNodes.forEach((el) => {
            el.classList.remove("selected");
          });

          si18nObj.setLocale(this.dataset.value);
          updateContent();
        };
      });
    }
  });

  updateFontSize("+", null, Number(localStorage.getItem("fontSizeLvl")) || 0);
  updateContent();

  $$("input[name=typ]").forEach((input) => {
    input.addEventListener("change", () => {
      USE_BOLD = input.value === "bold";
      updateContent();
    });
  });

  $("#custom-text").oninput = function() {
    $("#custom-text-validate").disabled = this.value.trim() === "";
  };

  $("#custom-text-toggle").onclick = () => {
    const container = $("#custom-text-section");
    container.style.display = container.style.display === "none" ? "block" : "none";
  };

  $("#custom-text-reset").onclick = () => {
    $("#custom-text").value = "";
    $("#custom-text-validate").disabled = true;
    USER_TEXTS = [];
    updateContent();
  };

  $("#custom-text-validate").onclick = validateUserText;

  $$(".hlang .current-lang, .hlang .more-lang").forEach((el) => {
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

  $(".font-size-container .incr").onclick = function() {
    updateFontSize("+", this);
  };

  $(".font-size-container .decr").onclick = function() {
    updateFontSize("-", this);
  };
});
