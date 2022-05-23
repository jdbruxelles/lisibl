import en from "./en.json" assert {type: "json"};
import fr from "./fr.json" assert {type: "json"};

const supportedLang = { en, fr };
const fallbackLang = "fr";

const getDefaultTexts = (langCode) => {
  const _resources_ = i18next.options.resources;
  const resources = _resources_[langCode] ? _resources_[langCode] : _resources_[fallbackLang];
  const samples = resources.translation.samples;
  let defaultTexts = [];

  for (const key in samples) {
    if (Object.hasOwnProperty.call(samples, key)) {
      defaultTexts.push(samples[key]);
    }
  }

  return defaultTexts;
};

const initI18n = (langCode) => {
  i18next.init({
    debug: false,
    lng: langCode, // default language
    fallbackLng: fallbackLang, // language to use when not found
    resources: supportedLang
  }).then(function(t) {
    updateI18n(langCode);
  });
};

const updateI18n = (langCode) => {
  i18next.changeLanguage(langCode);
  document.querySelectorAll("meta[property='og:description']," +
    " meta[property='twitter:description'], meta[name='description']").forEach((metaEl) => {
    metaEl.content = i18next.t("site.description");
  });

  document.querySelector("html").lang = langCode;
  document.querySelector(".site-description").innerText = i18next.t("site.description");

  const githubOcto = document.querySelector(".github-octo-corner")
  githubOcto.setAttribute("aria-label", i18next.t("utils.githubLink"));
  githubOcto.setAttribute("title", i18next.t("utils.githubLink"));

  document.getElementById("settings-title").innerText = i18next.t("utils.settings");
  document.querySelector("label[for=normal]").innerText = i18next.t("options.nomarlMode");
  document.querySelector("label[for=bold]").innerText = i18next.t("options.highlightMode");

  document.querySelector(".font-size-text span").innerText = i18next.t("options.fontSize");
  document.querySelector(".font-size-container .incr").setAttribute("title", i18next.t("utils.increase"));
  document.querySelector(".font-size-container .incr").setAttribute("aria-label", i18next.t("utils.increase"));
  document.querySelector(".font-size-container .decr").setAttribute("title", i18next.t("utils.decrease"));
  document.querySelector(".font-size-container .decr").setAttribute("aria-label", i18next.t("utils.decrease"));

  document.getElementById("custom-text").placeholder = i18next.t("options.pasteTextHere");
  document.getElementById("custom-text-toggle").innerText = i18next.t("buttons.addText");
  document.getElementById("custom-text-reset").innerText = i18next.t("buttons.reset");
  document.getElementById("custom-text-validate").innerText = i18next.t("buttons.validate");
};

export {
  initI18n,
  updateI18n,
  getDefaultTexts,
  supportedLang,
  fallbackLang
};
