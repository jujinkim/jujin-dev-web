export const KEY = "jujin.dashboard.v1";
export const IDS = ["market", "geeknews", "apps", "updates"];
export function defaults(language = "en") {
  return { version: 2, language: language.startsWith("ko") ? "ko" : "en", order: [...IDS], widths: { market: "wide", geeknews: "basic", apps: "basic", updates: "basic" } };
}
export function normalize(value, language = "en") {
  const base = defaults(language);
  if (!value || ![1, 2].includes(value.version) || !Array.isArray(value.order)) return base;
  base.order = [...new Set(value.order.filter(id => IDS.includes(id)))];
  // Introduce Apps once without restoring widgets the visitor already removed.
  if (value.version === 1 && base.order.length && !base.order.includes("apps")) base.order.push("apps");
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
