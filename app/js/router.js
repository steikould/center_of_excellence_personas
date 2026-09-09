/** Hash router. Every view state is addressable, bookmarkable and shareable. */

const listeners = new Set();

export function parseHash(hash = location.hash) {
  const clean = String(hash || "").replace(/^#/, "");
  const [pathPart, queryPart] = clean.split("?");
  const segments = pathPart.split("/").filter(Boolean).map(decodeURIComponent);
  return { segments, params: new URLSearchParams(queryPart || "") };
}

export function buildHash(segments, params) {
  const path = "#/" + segments.filter(Boolean).map(encodeURIComponent).join("/");
  const query = params ? String(params instanceof URLSearchParams ? params : new URLSearchParams(params)) : "";
  return query ? `${path}?${query}` : path;
}

export function navigate(segments, params, { replace = false } = {}) {
  const hash = buildHash(segments, params);
  if (hash === location.hash) { emit(); return; }
  if (replace) history.replaceState(null, "", hash);
  else location.hash = hash;
  if (replace) emit();
}

export function onRoute(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  const route = parseHash();
  listeners.forEach((fn) => fn(route));
}

export function startRouter() {
  window.addEventListener("hashchange", emit);
  if (!location.hash) history.replaceState(null, "", "#/");
  emit();
}

/** Keep the current query string (overlay, filters) while changing the path. */
export function withCurrentParams(overrides = {}) {
  const { params } = parseHash();
  for (const [k, v] of Object.entries(overrides)) {
    if (v === null || v === undefined || v === "") params.delete(k);
    else params.set(k, v);
  }
  return params;
}
