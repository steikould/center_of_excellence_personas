/** Small DOM and string helpers shared by every view. */

export function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const RAW = Symbol("raw");
export function raw(html) { return { [RAW]: String(html) }; }

/** Unwrap any template value into an HTML string, escaping anything unsafe. */
export function toHTML(value) {
  if (value == null || value === false || value === true) return "";
  if (Array.isArray(value)) return value.map(toHTML).join("");
  if (typeof value === "object" && value[RAW] !== undefined) return value[RAW];
  return esc(value);
}

/** Tagged template that escapes every interpolation unless wrapped in raw(). */
export function tpl(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += toHTML(values[i]) + strings[i + 1];
  }
  return raw(out);
}

export function render(target, node) {
  target.innerHTML = toHTML(node);
  return target;
}

export function qs(selector, scope = document) { return scope.querySelector(selector); }
export function qsa(selector, scope = document) { return [...scope.querySelectorAll(selector)]; }

/** Event delegation: one listener per container instead of one per row. */
export function delegate(root, eventName, selector, handler) {
  root.addEventListener(eventName, (event) => {
    const match = event.target.closest(selector);
    if (match && root.contains(match)) handler(event, match);
  });
}

export function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm || singular + "s"}`;
}

export function truncate(text, max = 140) {
  const t = String(text || "");
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

export function download(filename, text, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

let toastTimer = null;
export function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
}
