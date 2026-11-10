import test from "node:test";
import assert from "node:assert/strict";
import { defaults, normalize, move, stale, safeURL } from "../dashboard-state.mjs";
test("browser language defaults and invalid saved version recover", () => {
  assert.equal(defaults("ko-KR").language, "ko");
  assert.equal(defaults("ja").language, "en");
  assert.deepEqual(normalize({ version: 99, order: [] }, "ko"), defaults("ko"));
});
test("saved layout retains empty desk and removes unknown or duplicate widgets", () => {
  assert.deepEqual(normalize({ version: 1, order: [] }).order, []);
  const result = normalize({ version: 2, language: "ko", order: ["updates", "bad", "updates", "market"], widths: { updates: "wide", market: "invalid" } });
  assert.deepEqual(result.order, ["updates", "market"]);
  assert.equal(result.widths.updates, "wide");
  assert.equal(result.widths.market, "wide");
  assert.equal(result.language, "ko");
});
test("moves in either direction and bounds without mutating input", () => {
  const order = ["market", "geeknews", "updates"];
  assert.deepEqual(move(order, "market", 2), ["geeknews", "updates", "market"]);
  assert.deepEqual(move(order, "updates", -1), ["updates", "market", "geeknews"]);
  assert.deepEqual(order, ["market", "geeknews", "updates"]);
});
test("Apps migration preserves custom layout and happens only once", () => {
  const migrated = normalize({ version: 1, language: "ko", order: ["updates", "market"], widths: { market: "basic", updates: "wide" } });
  assert.deepEqual(migrated.order, ["updates", "market", "apps"]);
  assert.equal(migrated.version, 2);
  assert.equal(migrated.language, "ko");
  assert.equal(migrated.widths.market, "basic");
  assert.equal(migrated.widths.updates, "wide");
  assert.equal(migrated.widths.apps, "basic");
  migrated.order = migrated.order.filter(id => id !== "apps");
  assert.deepEqual(normalize(migrated).order, ["updates", "market"]);
  assert.deepEqual(normalize({ version: 1, order: [] }).order, []);
});
test("staleness uses collection time and rejects invalid timestamps", () => {
  const now = Date.parse("2026-11-10T12:00:00Z");
  assert.equal(stale("2026-11-10T11:30:00Z", now), false);
  assert.equal(stale("2026-11-10T10:29:00Z", now), true);
  assert.equal(stale("bad", now), true);
});
test("feed links reject executable and non-HTTPS schemes", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,test", "/relative", "http://example.com"]) assert.equal(safeURL(url), null);
  assert.equal(safeURL("https://news.hada.io/topic?id=1"), "https://news.hada.io/topic?id=1");
});
