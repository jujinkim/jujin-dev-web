import { KEY, IDS, defaults, normalize, move, stale, safeURL } from "./dashboard-state.mjs?v=apps-1";

const copy = {
  en: {
    skip: "Skip to content", dashboard: "Dashboard", title: "A good place to begin.", titleStart: "A good place to ", titleAccent: "begin.", lead: "The world outside your editor. News, markets, and things I’m building.", today: "TODAY", yourDesk: "YOUR DESK", reset: "Reset layout", edit: "Edit layout", done: "Done", add: "+ Add widget", editHint: "Drag a handle or use the arrow buttons. Choose a width that works for you.", storageWarning: "Settings cannot be saved in this browser. Changes will last for this tab only.", emptyDesk: "A clean slate. Add a widget to make this desk yours.", savedHere: "Your layout stays in this browser. Make yourself at home.", footer: "A daily desk for curious developers. Made by jujin.", about: "About me ↗", catalog: "Make room for something useful.", catalogHint: "Choose what belongs on your desk.", resetQuestion: "Restore the default layout?", resetDetail: "All widgets will return to their original positions and widths. Your language choice stays.", cancel: "Cancel", close: "Close", market: "Market at a glance", geeknews: "Latest on GeekNews", updates: "From jujin", marketDesc: "Eight indicators. A little context for the bigger picture.", geeknewsDesc: "Fresh stories from the Korean tech community.", updatesDesc: "New projects, small milestones, and notes along the way.", remove: "Remove", addOne: "Add", included: "On your desk", basic: "Standard", wide: "Wide", width: "Width", previous: "Move earlier", next: "Move later", drag: "Drag to move; use arrow buttons for keyboard movement", loading: "Gathering the latest…", error: "Couldn’t load this widget. Please try again.", retry: "Try again", delayed: "Update delayed", unavailable: "Unavailable", fetched: "Collected", quoteTime: "As of", cadence: "Snapshots · refreshed about every 30 min", latest: "Latest stories ↗", source: "Source", newsEmpty: "No stories yet.", updatesTitle: "Good things take a little time.", updatesBody: "New releases, experiments, and notes will find a home here. Stay curious.", exploreApps: "Explore my apps ↗", apps: "Apps", appsDesc: "Quick links to my web and Cozelsil apps.", moreApps: "More", appsNavigation: "App shortcuts", development: "In development", writing: "Notes & writing ↗", coming: "UPDATES TO COME", moved: "Layout updated.", saved: "Settings saved.", removed: "Widget removed.", added: "Widget added.", restored: "Default layout restored.", point: "Index points", goldUnit: "Gold futures · USD / troy oz", oilUnit: "WTI futures · USD / barrel", usdUnit: "KRW / 1 USD", jpyUnit: "KRW / 100 JPY", nav: "Main navigation", marketDetails: "Details", marketDetailsHide: "Hide details", marketCompactNames: ["KOSPI", "KOSDAQ", "NASDAQ", "S&P 500", "Gold futures", "WTI futures", "USD/KRW", "100 JPY/KRW"], marketNames: ["KOSPI", "KOSDAQ", "NASDAQ Composite", "S&P 500", "Gold", "WTI crude", "USD / KRW", "JPY / KRW"]
  },
  ko: {
    skip: "본문으로 이동", dashboard: "대시보드", title: "오늘의 시작, 여기서.", titleStart: "오늘의 시작, ", titleAccent: "여기서.", lead: "에디터 바깥의 세상. 개발 소식, 시장의 흐름, 그리고 내가 만드는 것들.", today: "오늘", yourDesk: "나의 대시보드", reset: "기본 배치", edit: "배치 편집", done: "편집 완료", add: "+ 위젯 추가", editHint: "손잡이를 끌거나 화살표 버튼으로 이동하세요. 위젯의 폭도 바꿀 수 있어요.", storageWarning: "이 브라우저에 설정을 저장할 수 없어요. 변경 사항은 현재 탭에서만 유지돼요.", emptyDesk: "비어 있는 책상. 필요한 위젯으로 채워보세요.", savedHere: "배치는 이 브라우저에 저장돼요. 편한 대로 꾸며보세요.", footer: "호기심 많은 개발자를 위한 매일의 공간. Made by jujin.", about: "만든 사람 ↗", catalog: "필요한 것만, 나의 대시보드에.", catalogHint: "매일 보고 싶은 위젯을 골라보세요.", resetQuestion: "기본 배치로 돌아갈까요?", resetDetail: "모든 위젯의 위치와 폭을 처음 상태로 되돌려요. 선택한 언어는 유지돼요.", cancel: "취소", close: "닫기", market: "한눈에 보는 시장", geeknews: "GeekNews 최신글", updates: "jujin의 소식", marketDesc: "주요 지표 8개로 살펴보는 시장의 흐름.", geeknewsDesc: "개발·기술 커뮤니티에서 전하는 새로운 이야기.", updatesDesc: "새로운 프로젝트, 작은 성과, 만드는 과정의 기록.", remove: "제거", addOne: "추가", included: "추가됨", basic: "기본", wide: "넓게", width: "위젯 폭", previous: "앞으로 이동", next: "뒤로 이동", drag: "끌어서 이동. 키보드는 화살표 버튼 사용", loading: "최신 소식을 불러오는 중…", error: "위젯을 불러오지 못했어요. 다시 시도해주세요.", retry: "다시 시도", delayed: "갱신 지연", unavailable: "조회 불가", fetched: "수집", quoteTime: "기준", cadence: "시세 스냅샷 · 약 30분마다 갱신", latest: "최신글 더 보기 ↗", source: "출처", newsEmpty: "아직 게시글이 없어요.", updatesTitle: "소식을 준비하고 있어요.", updatesBody: "새로 만든 것들, 작은 실험과 기록을 이곳에서 전할게요. 곧 만나요.", exploreApps: "내 앱 둘러보기 ↗", apps: "Apps", appsDesc: "웹 서비스와 Cozelsil 앱 바로가기.", moreApps: "더보기", appsNavigation: "앱 바로가기", development: "개발 중", writing: "블로그 읽기 ↗", coming: "UPDATES TO COME", moved: "배치를 변경했어요.", saved: "설정을 저장했어요.", removed: "위젯을 제거했어요.", added: "위젯을 추가했어요.", restored: "기본 배치로 돌아왔어요.", point: "지수 · 포인트", goldUnit: "금 선물 · USD / 트로이온스", oilUnit: "WTI 선물 · USD / 배럴", usdUnit: "1달러당 원화", jpyUnit: "100엔당 원화", nav: "주 메뉴", marketDetails: "상세", marketDetailsHide: "상세 접기", marketCompactNames: ["코스피", "코스닥", "나스닥", "S&P 500", "금 선물", "WTI 선물", "달러/원", "100엔/원"], marketNames: ["코스피", "코스닥", "나스닥 종합", "S&P 500", "금", "WTI 원유", "달러 환율", "엔 환율"]
  }
};
const registry = {
  market: { number: "01", source: "GLOBAL MARKETS", render: renderMarket },
  geeknews: { number: "02", source: "NEWS.HADA.IO", render: renderNews },
  apps: { number: "03", source: "", render: renderApps },
  updates: { number: "04", source: "BY JUJIN", render: renderUpdates }
};
const $ = selector => document.querySelector(selector);
let state = defaults(navigator.language), storageOK = true, editing = false;
try { state = normalize(JSON.parse(localStorage.getItem(KEY)), navigator.language); } catch { /* Corrupt settings recover to defaults. */ }
try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { storageOK = false; }
const data = new Map(), pending = new Map(), failed = new Set();
let drag = null;
let marketDetailsOpen = false;
const t = key => copy[state.language][key];
function el(tag, text, className) { const node = document.createElement(tag); if (text != null) node.textContent = text; if (className) node.className = className; return node; }
function button(label, fn, className = "quiet-button", title = label) { const node = el("button", label, className); node.type = "button"; node.title = title; node.setAttribute("aria-label", title); node.addEventListener("click", fn); return node; }
function link(text, url) { const node = el("a", text); node.href = safeURL(url) || "/"; return node; }
function announce(text) { $("#announcement").textContent = text; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { storageOK = false; } $("#storage-warning").hidden = storageOK; }
function timestamp(value) { const date = new Date(value); if (!Number.isFinite(date.getTime())) return "—"; return new Intl.DateTimeFormat(state.language === "ko" ? "ko-KR" : "en-GB", { timeZone: "Asia/Seoul", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date) + " KST"; }
function timeNode(value) { const node = el("time", timestamp(value)); node.dateTime = value; return node; }
function number(value, signed = false) { return new Intl.NumberFormat(state.language === "ko" ? "ko-KR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: signed ? "exceptZero" : "auto" }).format(value); }
function renderPage() {
  document.documentElement.lang = state.language;
  document.title = state.language === "ko" ? "jujin.dev — 개발자를 위한 대시보드" : "jujin.dev — Your developer dashboard";
  document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
  $("#desk-title").replaceChildren(document.createTextNode(t("titleStart")), el("em", t("titleAccent")));
  $("#language").textContent = state.language === "ko" ? "EN" : "한국어";
  $("#language").setAttribute("aria-label", state.language === "ko" ? "Switch to English" : "한국어로 전환");
  $("nav").setAttribute("aria-label", t("nav"));
  $("#close-catalog").setAttribute("aria-label", t("close"));
  $("#today").textContent = new Intl.DateTimeFormat(state.language === "ko" ? "ko-KR" : "en-GB", { timeZone: "Asia/Seoul", month: "short", day: "numeric", weekday: "short" }).format(new Date());
  $("#today").dateTime = new Date().toISOString();
  $("#edit").textContent = t(editing ? "done" : "edit");
  $("#edit").setAttribute("aria-pressed", String(editing));
  $("#edit-hint").hidden = $("#reset").hidden = !editing;
  $("#storage-warning").hidden = storageOK;
  renderWidgets();
  renderCatalog();
}
function renderWidgets(focusId, action = "drag") {
  const grid = $("#widgets"); grid.replaceChildren();
  for (const id of state.order) {
    const def = registry[id], card = el("section", null, "widget");
    card.dataset.id = id; card.dataset.width = state.widths[id]; card.setAttribute("aria-labelledby", `title-${id}`);
    if (editing) card.append(editControls(id));
    const heading = el("div", null, "widget-heading"), title = el("h2"); title.id = `title-${id}`;
    title.append(el("span", def.number, "widget-number"), document.createTextNode(t(id)));
    heading.append(title); if (def.source) heading.append(el("span", def.source, "widget-source")); card.append(heading);
    const body = el("div", null, "widget-body"); card.append(body); grid.append(card);
    if (data.has(id)) def.render(body, data.get(id));
    else if (failed.has(id)) renderError(body, id);
    else { body.append(el("div", t("loading"), "loading")); load(id); }
  }
  $("#empty-desk").hidden = state.order.length > 0;
  $("#widget-count").textContent = String(state.order.length).padStart(2, "0");
  if (focusId) {
    const control = grid.querySelector(`[data-id="${focusId}"] [data-action="${action}"]`);
    const fallback = grid.querySelector(`[data-id="${focusId}"] [data-action="drag"]`);
    (control?.disabled ? fallback : control)?.focus({ preventScroll: true });
  }
}
function editControls(id) {
  const controls = el("div", null, "widget-edit");
  const handle = button("⠿", () => {}, "quiet-button drag-handle", `${t(id)}: ${t("drag")}`); handle.dataset.action = "drag";
  handle.addEventListener("pointerdown", event => startDrag(event, id));
  controls.append(handle);
  for (const [delta, key, glyph] of [[-1, "previous", "↑"], [1, "next", "↓"]]) {
    const node = button(glyph, () => { state.order = move(state.order, id, state.order.indexOf(id) + delta); save(); renderWidgets(id, key); announce(t("moved")); }, "quiet-button", `${t(id)}: ${t(key)}`);
    node.disabled = delta < 0 ? state.order.indexOf(id) === 0 : state.order.indexOf(id) === state.order.length - 1;
    node.dataset.action = key; controls.append(node);
  }
  const select = el("select"); select.setAttribute("aria-label", `${t(id)}: ${t("width")}`); select.dataset.action = "width";
  for (const value of ["basic", "wide"]) { const option = el("option", t(value)); option.value = value; option.selected = state.widths[id] === value; select.append(option); }
  select.addEventListener("change", () => { state.widths[id] = select.value; save(); renderWidgets(id, "width"); announce(t("saved")); });
  controls.append(select, button("×", () => { state.order = state.order.filter(item => item !== id); save(); renderWidgets(); $("#add").focus(); announce(t("removed")); }, "quiet-button", `${t(id)}: ${t("remove")}`));
  return controls;
}
function renderCatalog() {
  const list = $("#catalog-items"); list.replaceChildren();
  for (const id of IDS) {
    const row = el("div", null, "catalog-item"), desc = el("div"); desc.append(el("strong", t(id)), el("p", t(`${id}Desc`)));
    const included = state.order.includes(id);
    const add = button(t(included ? "included" : "addOne"), () => { state.order.push(id); save(); renderWidgets(); renderCatalog(); announce(t("added")); $("#close-catalog").focus(); }, "quiet-button", `${t(id)}: ${t(included ? "included" : "addOne")}`);
    add.disabled = included; row.append(desc, add); list.append(row);
  }
}
function renderError(body, id) {
  const box = el("div", null, "error-state"); box.append(el("div", t("error")), button(t("retry"), () => load(id, true))); body.append(box);
}
async function load(id, force = false) {
  if (pending.has(id)) return pending.get(id);
  if (!force && (data.has(id) || failed.has(id))) return;
  const request = (async () => {
    try {
      const response = await fetch(`/data/${id}.json`, { cache: "no-cache", signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error("Fetch failed");
      const result = await response.json();
      if (result.schemaVersion !== 1 || !Array.isArray(result.items)) throw new Error("Invalid data");
      data.set(id, result); failed.delete(id);
    } catch { failed.add(id); }
    finally {
      pending.delete(id);
      const body = document.querySelector(`[data-id="${id}"] .widget-body`);
      if (body) {
        const previousList = body.querySelector(".news-list, .market-grid, .app-shortcuts");
        const scrollTop = previousList?.scrollTop || 0;
        const detailsFocused = body.contains(document.activeElement) && document.activeElement.dataset.action === "market-details";
        const focused = previousList?.contains(document.activeElement);
        const focusedHref = focused ? document.activeElement.getAttribute("href") : null;
        body.replaceChildren();
        if (data.has(id)) registry[id].render(body, data.get(id)); else renderError(body, id);
        const nextList = body.querySelector(".news-list, .market-grid, .app-shortcuts");
        if (nextList) {
          nextList.scrollTop = scrollTop;
          if (focused) (Array.from(nextList.querySelectorAll("a")).find(a => a.getAttribute("href") === focusedHref) || nextList).focus({ preventScroll: true });
        }
        if (detailsFocused) body.querySelector("[data-action=market-details]")?.focus({ preventScroll: true });
      }
    }
  })();
  pending.set(id, request); return request;
}
function renderMarket(body, payload) {
  const panel = el("div", null, "market-panel");
  panel.dataset.expanded = String(marketDetailsOpen);
  const grid = el("div", null, "market-grid");
  grid.id = "market-quotes"; grid.tabIndex = -1; grid.setAttribute("aria-label", t("market"));
  const units = ["point", "point", "point", "point", "goldUnit", "oilUnit", "usdUnit", "jpyUnit"];
  const ids = ["kospi", "kosdaq", "nasdaq", "sp500", "gold", "wti", "usdkrw", "jpykrw"];
  ids.forEach((id, index) => {
    const item = payload.items.find(entry => entry.id === id), quote = el("div", null, "market-quote");
    const name = item && safeURL(item.sourceUrl) ? link(t("marketCompactNames")[index], item.sourceUrl) : el("span", t("marketCompactNames")[index]);
    name.className = "market-name";
    name.title = `${t("marketNames")[index]} · ${t(units[index])}`;
    quote.append(name);
    if (item && Number.isFinite(item.value) && Number.isFinite(item.change) && Number.isFinite(item.changePercent)) {
      const value = (index === 4 || index === 5 ? "$" : "") + number(item.value);
      quote.append(el("div", value, "market-price"), el("div", `${number(item.changePercent, true)}%`, `market-change ${item.change > 0 ? "positive" : item.change < 0 ? "negative" : ""}`));
      const detail = el("div", null, "market-detail");
      detail.append(el("span", t(units[index])), el("span", number(item.change, true)), el("span", `${t("quoteTime")} ${timestamp(item.sourceTime)}`));
      quote.append(detail);
      if (stale(item.collectedAt)) quote.append(el("div", t("delayed"), "market-delayed stale"));
    } else quote.append(el("div", "—", "market-price"), el("div", "—", "market-change"), el("div", t("unavailable"), "market-delayed"));
    grid.append(quote);
  });
  panel.append(grid);
  const bottom = el("div", null, "widget-bottom"), meta = el("div", null, "market-meta");
  const toggle = button(t(marketDetailsOpen ? "marketDetailsHide" : "marketDetails"), () => {
    marketDetailsOpen = !marketDetailsOpen;
    panel.dataset.expanded = String(marketDetailsOpen);
    toggle.textContent = t(marketDetailsOpen ? "marketDetailsHide" : "marketDetails");
    toggle.setAttribute("aria-label", toggle.textContent); toggle.title = toggle.textContent;
    toggle.setAttribute("aria-expanded", String(marketDetailsOpen));
  }, "quiet-button market-details-toggle");
  toggle.dataset.action = "market-details";
  toggle.setAttribute("aria-expanded", String(marketDetailsOpen)); toggle.setAttribute("aria-controls", "market-quotes");
  meta.append(el("span", t("cadence")), toggle);
  bottom.append(meta, link("Yahoo Finance ↗", "https://finance.yahoo.com/"));
  panel.append(bottom); body.append(panel);
}
function renderNews(body, payload) {
  const list = el("ol", null, "news-list");
  list.tabIndex = 0; list.setAttribute("aria-label", t("geeknews"));
  for (const item of payload.items.slice(0, 10)) {
    if (!safeURL(item.url)) continue;
    const row = el("li", null, "news-item"), content = el("div"); content.append(link(item.title, item.url), timeNode(item.publishedAt)); row.append(content); list.append(row);
  }
  if (!list.children.length) body.append(el("p", t("newsEmpty"), "loading")); else body.append(list);
  const bottom = el("div", null, "widget-bottom");
  bottom.append(el("span", `${stale(payload.collectedAt) ? t("delayed") + " · " : ""}${t("fetched")} ${timestamp(payload.collectedAt)}`, stale(payload.collectedAt) ? "stale" : ""), link(t("latest"), "https://news.hada.io/new")); body.append(bottom);
}
function renderApps(body, payload) {
  const shortcuts = el("div", null, "app-shortcuts");
  shortcuts.tabIndex = -1;
  shortcuts.setAttribute("role", "group"); shortcuts.setAttribute("aria-label", t("appsNavigation"));
  const heading = body.previousElementSibling;
  heading.querySelector(".apps-status")?.remove();
  if (stale(payload.collectedAt) || failed.has("apps")) {
    const status = el("span", t("delayed"), "widget-source stale apps-status");
    status.title = `${t("fetched")} ${timestamp(payload.collectedAt)}`;
    heading.append(status);
  }
  // Keep two short rows; the directory contains the complete, synced catalog.
  for (const app of payload.items.filter(app => safeURL(app.url)).slice(0, 7)) {
    const label = app.title + (app.status === "development" ? ` · ${t("development")}` : "");
    const anchor = link("", app.url); anchor.className = "app-shortcut";
    anchor.title = label; anchor.setAttribute("aria-label", label);
    const fallback = () => {
      const icon = el("span", app.emoji || app.title.slice(0, 1), "app-emoji");
      icon.setAttribute("aria-hidden", "true"); anchor.replaceChildren(icon);
    };
    if (app.icon && (safeURL(app.icon) || /^\/assets\/apps\/[a-z0-9-]+\.(svg|png)$/.test(app.icon))) {
      const icon = el("img"); icon.src = app.icon; icon.alt = ""; icon.width = 32; icon.height = 32; icon.decoding = "async";
      icon.addEventListener("error", fallback, { once: true }); anchor.append(icon);
    } else fallback();
    shortcuts.append(anchor);
  }
  const more = el("a", t("moreApps"), "app-shortcut apps-more");
  more.href = "/apps/"; more.setAttribute("aria-label", t("exploreApps"));
  shortcuts.append(more); body.append(shortcuts);
}
function renderUpdates(body, payload) {
  if (payload.items.length) {
    const list = el("ol", null, "news-list");
    for (const item of payload.items.slice(0, 10)) { if (!safeURL(item.url)) continue; const row = el("li", null, "news-item"), content = el("div"); content.append(link(item.title, item.url), timeNode(item.publishedAt)); row.append(content); list.append(row); } body.append(list);
  } else {
    const box = el("div", null, "updates-empty"); const mark = el("span", "j.", "empty-mark"); mark.setAttribute("aria-hidden", "true"); box.append(mark, el("h3", t("updatesTitle")), el("p", t("updatesBody"))); body.append(box);
  }
  const links = el("div", null, "updates-links"); const apps = el("a", t("exploreApps")); apps.href = "/apps/"; links.append(apps, link(t("writing"), "https://blog.jujin.kim")); body.append(links);
}
function startDrag(event, id) {
  if (event.button !== 0 || drag) return;
  const card = event.currentTarget.closest(".widget");
  event.currentTarget.setPointerCapture(event.pointerId);
  drag = { id, handle: event.currentTarget, card, startX: event.clientX, startY: event.clientY, y: event.clientY, target: id, active: false, frame: null };
  drag.handle.addEventListener("pointermove", dragMove);
  drag.handle.addEventListener("pointerup", finishDrag);
  drag.handle.addEventListener("pointercancel", cancelDrag);
}
function dragMove(event) {
  if (!drag) return;
  drag.y = event.clientY;
  if (!drag.active && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 6) return;
  drag.active = true; drag.card.classList.add("dragging");
  const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".widget");
  document.querySelectorAll(".drop-target").forEach(node => node.classList.remove("drop-target"));
  if (target && target !== drag.card) { drag.target = target.dataset.id; target.classList.add("drop-target"); } else drag.target = drag.id;
  if (!drag.frame) drag.frame = requestAnimationFrame(dragScroll);
}
function dragScroll() {
  if (!drag) return;
  const delta = drag.y < 90 ? -12 : drag.y > innerHeight - 90 ? 12 : 0;
  if (delta) window.scrollBy(0, delta);
  drag.frame = requestAnimationFrame(dragScroll);
}
function finishDrag() {
  if (!drag) return;
  const { id, target, active } = drag;
  cleanupDrag();
  if (active && target !== id) { state.order = move(state.order, id, state.order.indexOf(target)); save(); renderWidgets(id); announce(t("moved")); }
}
function cleanupDrag() {
  if (!drag) return;
  cancelAnimationFrame(drag.frame);
  drag.handle.removeEventListener("pointermove", dragMove); drag.handle.removeEventListener("pointerup", finishDrag); drag.handle.removeEventListener("pointercancel", cancelDrag);
  document.querySelectorAll(".dragging, .drop-target").forEach(node => node.classList.remove("dragging", "drop-target")); drag = null;
}
function cancelDrag() { cleanupDrag(); }
$("#language").addEventListener("click", () => { cancelDrag(); state.language = state.language === "ko" ? "en" : "ko"; save(); renderPage(); });
$("#edit").addEventListener("click", () => { cancelDrag(); editing = !editing; renderPage(); });
for (const id of ["add", "empty-add"]) $(`#${id}`).addEventListener("click", () => { renderCatalog(); $("#catalog").showModal(); });
$("#close-catalog").addEventListener("click", () => $("#catalog").close());
$("#reset").addEventListener("click", () => $("#reset-dialog").showModal());
$("#cancel-reset").addEventListener("click", () => $("#reset-dialog").close());
$("#confirm-reset").addEventListener("click", () => { state = defaults(state.language); save(); $("#reset-dialog").close(); renderPage(); announce(t("restored")); });
window.addEventListener("keydown", event => { if (event.key === "Escape") cancelDrag(); });
window.addEventListener("blur", cancelDrag);
renderPage();
// Revalidate visible snapshots without refetching upstream providers per visitor.
setInterval(() => { if (!document.hidden && !drag) for (const id of state.order) load(id, true); }, 5 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) for (const id of state.order) load(id, true); });
