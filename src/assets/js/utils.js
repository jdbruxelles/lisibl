const getURL = () => new URL(window.location.href);

export const escapeHTMLTags = (text) =>
  text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const getUrlParam = (param) => getURL().searchParams.get(param);

export function setUrlParam(param, value) {
  const url = getURL();
  url.searchParams.set(param, value);
  window.history.replaceState({}, "", url.href);
}

export function removeUrlParam(param) {
  const url = getURL();
  url.searchParams.delete(param);
  window.history.replaceState({}, "", url.href);
}
