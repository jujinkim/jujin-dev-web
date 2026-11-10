#!/usr/bin/env python3
"""Build a static Pages artifact with validated, last-good dashboard snapshots."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import json
import math
from pathlib import Path
import shutil
import time
from urllib.parse import quote, urlparse
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


def build(output, previous_base):
    now = utcnow()
    market, warnings = collect_market(now, previous_snapshot(previous_base, "market"))
    news, news_warnings = collect_news(now, previous_snapshot(previous_base, "geeknews"))
    warnings += news_warnings
    # Stage only public assets. Never publish repository metadata, logs, tests or scripts.
    output.mkdir(parents=True, exist_ok=True)
    for filename in FILES:
        shutil.copy2(ROOT / filename, output / filename)
    shutil.copytree(ROOT / "apps", output / "apps", dirs_exist_ok=True)
    (output / "data").mkdir(exist_ok=True)
    shutil.copy2(ROOT / "data/updates.json", output / "data/updates.json")
    for name, payload in (("market", market), ("geeknews", news)):
        (output / "data" / f"{name}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    for warning in warnings:
        print(f"::warning::{warning}")
    count = len(news["items"])
    print(f"Built {output}: 8 market quotes, {count} news items; {len(warnings)} upstream warnings.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "dist")
    parser.add_argument("--previous-base", default="https://jujin.dev")
    args = parser.parse_args()
    build(args.output, args.previous_base)
