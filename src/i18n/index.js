import en from "./en.json" assert {type: "json"};
import fr from "./fr.json" assert {type: "json"};

let defaultTexts = [];
const locale = window.navigator.language?.substring(0, 2) || "fr";
const fallbackLng = "fr";

i18next.init({
  lng: locale, // default language
  fallbackLng, // language to use when not found
  debug: !true,
  resources: { en, fr }
}).then(function(t) {
  const _resources_ = i18next.options.resources;
  const resources = _resources_[locale] ? _resources_[locale] : _resources_[fallbackLng];
  const samples = resources.translation.samples;

  for (const key in samples) {
    if (Object.hasOwnProperty.call(samples, key)) {
      defaultTexts.push(samples[key]);
    }
  }

  document.querySelectorAll("meta[property='og:description']," +
    " meta[property='twitter:description'], meta[name='description']").forEach((metaEl) => {
    metaEl.content = t("site.description");
  });

  const githubOcto = document.querySelector(".github-octo-corner")
  githubOcto.setAttribute("aria-label", t("utils.githubLink"));
  githubOcto.setAttribute("title", t("utils.githubLink"));

  document.getElementById("settings-title").innerText = t("utils.settings");
  document.querySelector("label[for=normal]").innerText = t("options.nomarlMode");
  document.querySelector("label[for=bold]").innerText = t("options.highlightMode");

  document.getElementById("custom-text").placeholder = t("options.pasteTextHere");
  document.getElementById("custom-text-toggle").innerText = t("buttons.addText");
  document.getElementById("custom-text-reset").innerText = t("buttons.reset");
  document.getElementById("custom-text-validate").innerText = t("buttons.validate");
});

export { defaultTexts, locale };
