const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const escapeHTMLTags = (text) => text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export { $, $$, escapeHTMLTags };
