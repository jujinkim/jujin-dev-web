#!/usr/bin/env python3
"""Build a static Pages artifact with validated, last-good dashboard snapshots."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from html import escape
import json
import math
from pathlib import Path
import re
import shutil
import time
from urllib.parse import quote, urljoin, urlparse
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
MARKETS = [
    ("kospi", "^KS11", 1), ("kosdaq", "^KQ11", 1),
    ("nasdaq", "^IXIC", 1), ("sp500", "^GSPC", 1),
    ("gold", "GC=F", 1), ("wti", "CL=F", 1),
    ("usdkrw", "KRW=X", 1), ("jpykrw", "JPYKRW=X", 100),
]
FILES = ["index.html", "hub.css", "dashboard.css", "dashboard.js", "dashboard-state.mjs", "favicon.svg", "404.html", "sitemap.xml", "robots.txt", "CNAME", ".nojekyll"]
APPS_SOURCE = "https://cozelsil.com/apps.json"
LOCAL_APPS = [
    {"id": "kickoff", "title": "Kickoff", "url": "https://kickoff.jujin.dev/", "icon": "/assets/apps/kickoff.svg", "emoji": "", "status": "published", "group": "web", "description": ""},
    {"id": "odiman", "title": "Odiman", "url": "https://odiman.jujin.dev/", "icon": "/assets/apps/odiman.svg", "emoji": "", "status": "published", "group": "web", "description": ""},
    {"id": "cryptic", "title": "Cryptic WikiNet", "url": "https://cryptic.jujin.dev/", "icon": "/assets/apps/cryptic.svg", "emoji": "", "status": "published", "group": "web", "description": ""},
]


def utcnow():
    return datetime.now(timezone.utc).isoformat()


def parse_date(value):
    date = datetime.fromisoformat(value.replace("Z", "+00:00"))
    if date.tzinfo is None:
        raise ValueError("Timestamp must include timezone")
    return date


def https_url(value):
    parsed = urlparse(value)
    return parsed.scheme == "https" and bool(parsed.hostname) and not parsed.username


def fetch(url, attempts=3):
    for attempt in range(attempts):
        try:
            request = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; jujin-dashboard/1.0)", "Accept": "application/json, application/atom+xml, text/xml"})
            with urlopen(request, timeout=18) as response:
                raw = response.read(2_000_001)
                if len(raw) > 2_000_000:
                    raise ValueError("Response too large")
                return raw
        except Exception:
            if attempt == attempts - 1:
                raise
            time.sleep(1 + attempt)


def parse_feed(raw, now):
    root = ET.fromstring(raw)
    ns = {"a": "http://www.w3.org/2005/Atom"}
    items, seen = [], set()
    for entry in root.findall("a:entry", ns):
        title = (entry.findtext("a:title", default="", namespaces=ns)).strip()
        links = entry.findall("a:link", ns)
        url = next((node.get("href", "") for node in links if node.get("rel", "alternate") == "alternate"), "")
        published = entry.findtext("a:published", namespaces=ns) or entry.findtext("a:updated", namespaces=ns)
        if not title or not https_url(url) or url in seen or not published:
            continue
        try:
            published = parse_date(published).isoformat()
        except (ValueError, TypeError):
            continue
        seen.add(url)
        items.append({"title": title, "url": url, "publishedAt": published})
    if not items:
        raise ValueError("Feed has no valid entries")
    items.sort(key=lambda item: parse_date(item["publishedAt"]), reverse=True)
    return {"schemaVersion": 1, "collectedAt": now, "sourceUrl": "https://news.hada.io/rss/news", "items": items[:10]}


def normalize_quote(payload, spec, now):
    item_id, symbol, multiplier = spec
    chart = payload["chart"]
    if chart.get("error"):
        raise ValueError("Upstream chart error")
    meta = chart["result"][0]["meta"]
    if meta["symbol"] != symbol:
        raise ValueError("Unexpected symbol")
    # range=1d is essential: chartPreviousClose for longer ranges is NOT yesterday.
    value = float(meta["regularMarketPrice"])
    previous = float(meta.get("previousClose") or meta["chartPreviousClose"])
    if not all(math.isfinite(v) and v > 0 for v in (value, previous)):
        raise ValueError("Invalid quote")
    source_time = datetime.fromtimestamp(meta["regularMarketTime"], timezone.utc)
    if source_time.timestamp() > parse_date(now).timestamp() + 300:
        raise ValueError("Future quote")
    return {"id": item_id, "symbol": symbol, "value": round(value * multiplier, 6),
            "change": round((value - previous) * multiplier, 6),
            "changePercent": round((value / previous - 1) * 100, 6),
            "sourceTime": source_time.isoformat(), "collectedAt": now,
            "sourceUrl": "https://finance.yahoo.com/quote/" + quote(symbol, safe="") + "/"}


def valid_old_quote(item, spec):
    try:
        if item["id"] != spec[0] or item["symbol"] != spec[1]:
            return False
        if not all(type(item[k]) in (float, int) and math.isfinite(item[k]) for k in ("value", "change", "changePercent")) or item["value"] <= 0:
            return False
        parse_date(item["collectedAt"])
        parse_date(item["sourceTime"])
        return https_url(item["sourceUrl"])
    except (KeyError, TypeError, ValueError):
        return False


def collect_market(now, previous=None, getter=fetch):
    old = {item.get("id"): item for item in (previous or {}).get("items", []) if isinstance(item, dict)}
    warnings = []
    def collect(spec):
        try:
            url = "https://query1.finance.yahoo.com/v8/finance/chart/" + quote(spec[1], safe="") + "?interval=1d&range=1d"
            return normalize_quote(json.loads(getter(url)), spec, now), None
        except Exception as error:
            if valid_old_quote(old.get(spec[0], {}), spec):
                return old[spec[0]], f"{spec[0]}: retained last good quote ({type(error).__name__})"
            raise RuntimeError(f"{spec[0]}: no valid current or previous quote") from error
    with ThreadPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(collect, MARKETS))
    items = []
    for item, warning in results:
        items.append(item)
        if warning:
            warnings.append(warning)
    return {"schemaVersion": 1, "generatedAt": now, "items": items}, warnings


def previous_snapshot(base_url, name):
    if not base_url:
        return None
    try:
        payload = json.loads(fetch(base_url.rstrip("/") + "/data/" + name + ".json", attempts=1))
        if payload.get("schemaVersion") == 1 and isinstance(payload.get("items"), list):
            return payload
    except Exception:
        pass
    return None


def collect_news(now, previous=None, getter=fetch):
    try:
        return parse_feed(getter("https://news.hada.io/rss/news"), now), []
    except Exception as error:
        if previous and previous.get("items"):
            parse_date(previous["collectedAt"])
            for item in previous["items"]:
                if not isinstance(item["title"], str) or not https_url(item["url"]):
                    raise ValueError("Invalid prior feed") from error
                parse_date(item["publishedAt"])
            return previous, [f"GeekNews: retained last good feed ({type(error).__name__})"]
        raise RuntimeError("GeekNews: no valid current or previous feed") from error


def normalize_apps(payload):
    if not isinstance(payload, list) or len(payload) > 200:
        raise ValueError("Invalid app catalog")
    items, seen = [], set()
    for app in payload:
        if not isinstance(app, dict):
            raise ValueError("Invalid app entry")
        if "_comment" in app and "id" not in app:
            continue
        app_id, title = app.get("id", ""), app.get("title", "")
        if not isinstance(app_id, str) or not re.fullmatch(r"[a-zA-Z0-9_-]+", app_id) or app_id in seen:
            raise ValueError("Invalid or duplicate app ID")
        if not isinstance(title, str) or not title.strip() or len(title) > 160 or app.get("status") not in ("published", "development"):
            raise ValueError("Invalid app title or status")
        seen.add(app_id)
        url = "https://cozelsil.com/"
        for link in app.get("links", []):
            if link.get("type") == "primary" and link.get("url"):
                url = urljoin(APPS_SOURCE, link["url"])
                if not https_url(url):
                    raise ValueError("Unsafe app link")
                break
        raw_icon = app.get("icon", "")
        if not isinstance(raw_icon, str):
            raise ValueError("Invalid app icon")
        icon, emoji = "", ""
        if raw_icon and any(ord(char) > 127 for char in raw_icon) and len(raw_icon) <= 16 and not any(char in raw_icon for char in "/:<>"):
            emoji = raw_icon
        elif raw_icon:
            icon = urljoin(APPS_SOURCE, raw_icon)
            if not https_url(icon):
                raise ValueError("Unsafe app icon")
        elif app_id == "dagali":
            # Official project favicon while the studio catalog has no icon.
            icon = "/assets/apps/dagali.svg"
        description = app.get("description", "")
        if not isinstance(description, str) or len(description) > 2000:
            raise ValueError("Invalid app description")
        items.append({"id": "cozelsil-" + app_id, "title": title.strip(), "url": url, "icon": icon, "emoji": emoji,
                      "status": app["status"], "group": "cozelsil", "description": description})
    return items


def collect_apps(now, previous=None, getter=fetch):
    try:
        items = normalize_apps(json.loads(getter(APPS_SOURCE)))
        collected = now
        warnings = []
    except Exception as error:
        # Validate the previous snapshot before using it; keep its collection time.
        try:
            if previous["schemaVersion"] != 1 or previous["sourceUrl"] != APPS_SOURCE:
                raise ValueError("Invalid previous catalog source")
            collected = previous["collectedAt"]
            parse_date(collected)
            items = [item for item in previous["items"] if item["group"] == "cozelsil"]
            for item in items:
                if not re.fullmatch(r"cozelsil-[a-zA-Z0-9_-]+", item["id"]) or not isinstance(item["title"], str) or not item["title"].strip() or not https_url(item["url"]):
                    raise ValueError("Invalid previous app")
                if item["icon"] and item["icon"] != "/assets/apps/dagali.svg" and not https_url(item["icon"]):
                    raise ValueError("Unsafe previous app icon")
                if item["status"] not in ("published", "development") or not all(isinstance(item[key], str) for key in ("description", "emoji", "icon")):
                    raise ValueError("Invalid previous app metadata")
        except (KeyError, TypeError, ValueError) as invalid:
            raise RuntimeError("Apps: no valid current or previous catalog") from invalid
        warnings = [f"Apps: retained last good catalog ({type(error).__name__})"]
    return {"schemaVersion": 1, "collectedAt": collected, "sourceUrl": APPS_SOURCE, "items": LOCAL_APPS + items}, warnings


def render_apps_directory(template, payload):
    cards = []
    for item in payload["items"]:
        if item["group"] != "cozelsil":
            continue
        if item["icon"]:
            icon = f'<img src="{escape(item["icon"], quote=True)}" alt="" width="40" height="40" loading="lazy" />'
        else:
            icon = f'<span aria-hidden="true">{escape(item["emoji"] or item["title"][:1])}</span>'
        status = '<span class="studio-status">In development</span>' if item["status"] == "development" else ""
        cards.append(f'<a class="studio-app" href="{escape(item["url"], quote=True)}"><span class="studio-icon">{icon}</span>'
                     f'<span class="studio-copy"><strong>{escape(item["title"])}</strong>{status}<span>{escape(item["description"])}</span></span>'
                     '<span aria-hidden="true">↗</span></a>')
    if template.count("<!-- COZELSIL_APPS -->") != 1:
        raise ValueError("Missing Apps directory placeholder")
    return template.replace("<!-- COZELSIL_APPS -->", "\n".join(cards))


def build(output, previous_base):
    now = utcnow()
    market, warnings = collect_market(now, previous_snapshot(previous_base, "market"))
    news, news_warnings = collect_news(now, previous_snapshot(previous_base, "geeknews"))
    warnings += news_warnings
    apps, app_warnings = collect_apps(now, previous_snapshot(previous_base, "apps"))
    warnings += app_warnings
    # Stage only public assets. Never publish repository metadata, logs, tests or scripts.
    output.mkdir(parents=True, exist_ok=True)
    for filename in FILES:
        shutil.copy2(ROOT / filename, output / filename)
    shutil.copytree(ROOT / "apps", output / "apps", dirs_exist_ok=True)
    shutil.copytree(ROOT / "assets/apps", output / "assets/apps", dirs_exist_ok=True)
    (output / "apps/index.html").write_text(render_apps_directory((ROOT / "apps/index.html").read_text(), apps))
    (output / "data").mkdir(exist_ok=True)
    shutil.copy2(ROOT / "data/updates.json", output / "data/updates.json")
    for name, payload in (("market", market), ("geeknews", news), ("apps", apps)):
        (output / "data" / f"{name}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    for warning in warnings:
        print(f"::warning::{warning}")
    count = len(news["items"])
    print(f"Built {output}: 8 market quotes, {count} news items, {len(apps['items'])} apps; {len(warnings)} upstream warnings.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist")
    parser.add_argument("--previous-base", default="https://jujin.dev")
    args = parser.parse_args()
    build(args.output, args.previous_base)
