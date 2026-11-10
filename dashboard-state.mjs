export const KEY = "jujin.dashboard.v1";
export const IDS = ["market", "geeknews", "updates"];
export function defaults(language = "en") {
  return { version: 1, language: language.startsWith("ko") ? "ko" : "en", order: [...IDS], widths: { market: "wide", geeknews: "basic", updates: "basic" } };
}
export function normalize(value, language = "en") {
  const base = defaults(language);
  if (!value || value.version !== 1 || !Array.isArray(value.order)) return base;
  base.order = [...new Set(value.order.filter(id => IDS.includes(id)))];
  if (["ko", "en"].includes(value.language)) base.language = value.language;
  for (const id of IDS) if (["basic", "wide"].includes(value.widths?.[id])) base.widths[id] = value.widths[id];
  return base;
}
export function move(order, id, target) {
  const next = order.filter(item => item !== id);
  next.splice(Math.max(0, Math.min(target, next.length)), 0, id);
  return next;
}
export function stale(timestamp, now = Date.now()) {
  const value = Date.parse(timestamp);
  return !Number.isFinite(value) || now - value > 90 * 60 * 1000;
}
export function safeURL(value) {
  try { const url = new URL(value); return url.protocol === "https:" ? url.href : null; } catch { return null; }
}
