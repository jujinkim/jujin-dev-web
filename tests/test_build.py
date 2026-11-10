import importlib.util
import json
from pathlib import Path
import unittest
from urllib.parse import unquote, urlparse

spec = importlib.util.spec_from_file_location("build", Path(__file__).resolve().parents[1] / "scripts/build.py")
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)
NOW = "2026-11-10T12:00:00+00:00"


def chart(symbol, value=101, previous=100):
    return {"chart": {"error": None, "result": [{"meta": {"symbol": symbol, "regularMarketPrice": value, "chartPreviousClose": previous, "regularMarketTime": 1794308400}}]}}


class DataTests(unittest.TestCase):
    def test_quote_change_and_yen_scaling(self):
        item = build.normalize_quote(chart("JPYKRW=X", 8.5, 8.4), build.MARKETS[-1], NOW)
        self.assertEqual(item["value"], 850)
        self.assertEqual(item["change"], 10)
        self.assertAlmostEqual(item["changePercent"], 1.190476)
        self.assertNotEqual(item["sourceTime"], item["collectedAt"])

    def test_quote_rejects_bad_symbol_zero_nan_future(self):
        for payload in [chart("wrong"), chart("^KS11", 0), chart("^KS11", float("nan")), chart("^KS11", 10, 0)]:
            with self.assertRaises(ValueError):
                build.normalize_quote(payload, build.MARKETS[0], NOW)
        payload = chart("^KS11")
        payload["chart"]["result"][0]["meta"]["regularMarketTime"] = 9999999999
        with self.assertRaises(ValueError):
            build.normalize_quote(payload, build.MARKETS[0], NOW)

    def test_partial_failure_retains_original_collection_time(self):
        previous = {"items": [build.normalize_quote(chart(symbol), spec, "2026-11-10T11:00:00+00:00") for spec in build.MARKETS for symbol in [spec[1]]]}
        def getter(url):
            if "%5EKS11" in url:
                raise TimeoutError()
            symbol = unquote(urlparse(url).path.rsplit("/", 1)[-1])
            return json.dumps(chart(symbol)).encode()
        current, warnings = build.collect_market(NOW, previous, getter)
        self.assertEqual(len(current["items"]), 8)
        self.assertEqual(current["items"][0], previous["items"][0])
        self.assertEqual(current["items"][1]["collectedAt"], NOW)
        self.assertEqual(len(warnings), 1)

    def test_first_collection_fails_without_valid_previous_data(self):
        def broken(url):
            raise TimeoutError()
        with self.assertRaises(RuntimeError):
            build.collect_market(NOW, None, broken)
        with self.assertRaises(RuntimeError):
            build.collect_news(NOW, None, broken)

    def test_feed_sorts_deduplicates_and_rejects_unsafe_links(self):
        raw = b"""<feed xmlns="http://www.w3.org/2005/Atom">
        <entry><title>Old</title><link href="https://news.hada.io/topic?id=1"/><published>2026-11-09T10:00:00+09:00</published></entry>
        <entry><title>New &amp; safe</title><link href="https://news.hada.io/topic?id=2"/><updated>2026-11-10T10:00:00+09:00</updated></entry>
        <entry><title>Duplicate</title><link href="https://news.hada.io/topic?id=2"/><updated>2026-11-10T10:00:00+09:00</updated></entry>
        <entry><title>Unsafe</title><link href="javascript:alert(1)"/><updated>2026-11-10T10:00:00+09:00</updated></entry>
        </feed>"""
        result = build.parse_feed(raw, NOW)
        self.assertEqual([item["title"] for item in result["items"]], ["New & safe", "Old"])
        self.assertEqual(result["collectedAt"], NOW)
        with self.assertRaises(ValueError):
            build.parse_feed(b"<feed/>", NOW)

    def test_feed_failure_preserves_last_good_snapshot(self):
        previous = {"schemaVersion": 1, "collectedAt": "2026-11-10T10:00:00+00:00", "items": [{"title": "Story", "url": "https://news.hada.io/topic?id=1", "publishedAt": NOW}]}
        result, warnings = build.collect_news(NOW, previous, lambda url: b"broken xml")
        self.assertIs(result, previous)
        self.assertEqual(len(warnings), 1)

    def test_apps_keep_source_order_icons_and_first_available_primary_link(self):
        source = [{"_comment": "Schema documentation"},
                  {"id": "notes", "title": "Notes", "status": "published", "icon": "📝", "links": [{"type": "primary", "url": "/notes/"}]},
                  {"id": "dagali", "title": "DaGaLi", "status": "development", "icon": "", "links": [{"type": "primary", "url": ""}, {"type": "primary", "url": "https://ddal.ggak.life"}]},
                  {"id": "image", "title": "Image", "status": "published", "icon": "app-icons/image.png", "links": []}]
        apps = build.normalize_apps(source)
        self.assertEqual([app["id"] for app in apps], ["cozelsil-notes", "cozelsil-dagali", "cozelsil-image"])
        self.assertEqual(apps[0]["emoji"], "📝")
        self.assertEqual(apps[0]["url"], "https://cozelsil.com/notes/")
        self.assertEqual(apps[1]["url"], "https://ddal.ggak.life")
        self.assertEqual(apps[1]["icon"], "/assets/apps/dagali.svg")
        self.assertEqual(apps[2]["icon"], "https://cozelsil.com/app-icons/image.png")
        self.assertEqual(apps[2]["url"], "https://cozelsil.com/")

    def test_apps_sync_additions_removals_and_metadata_changes(self):
        def app(app_id, title):
            return {"id": app_id, "title": title, "status": "published", "links": []}
        initial, _ = build.collect_apps(NOW, getter=lambda url: json.dumps([app("one", "Old"), app("two", "Two")]).encode())
        later, warnings = build.collect_apps(NOW, initial, lambda url: json.dumps([app("two", "Renamed"), app("three", "New")]).encode())
        self.assertEqual([item["id"] for item in later["items"]], ["kickoff", "odiman", "cryptic", "cozelsil-two", "cozelsil-three"])
        self.assertEqual(later["items"][3]["title"], "Renamed")
        self.assertEqual(warnings, [])
        empty, _ = build.collect_apps(NOW, later, lambda url: b"[]")
        self.assertEqual(empty["items"], build.LOCAL_APPS)

    def test_apps_failure_retains_valid_snapshot_and_its_age(self):
        old_time = "2026-11-10T10:00:00+00:00"
        source = [{"id": "app", "title": "App", "status": "published", "links": []}]
        old, _ = build.collect_apps(old_time, getter=lambda url: json.dumps(source).encode())
        for broken in [b"not json", b"{}", json.dumps(source * 2).encode(), b'[{"id":"app","title":"App","status":"published","icon":"javascript:alert(1)"}]']:
            current, warnings = build.collect_apps(NOW, old, lambda url: broken)
            self.assertEqual(current, old)
            self.assertEqual(len(warnings), 1)
            with self.assertRaises(RuntimeError):
                build.collect_apps(NOW, None, lambda url: broken)
        old["items"][-1]["url"] = "javascript:alert(1)"
        with self.assertRaises(RuntimeError):
            build.collect_apps(NOW, old, lambda url: b"broken")

    def test_apps_directory_escapes_catalog_content(self):
        source = [{"id": "app", "title": '<script>"Title"</script>', "description": "<img onerror=alert(1)>", "icon": "📝", "status": "development", "links": [{"type": "primary", "url": "https://example.com/?a=1&b=2"}]}]
        apps, _ = build.collect_apps(NOW, getter=lambda url: json.dumps(source).encode())
        html = build.render_apps_directory("<!-- COZELSIL_APPS -->", apps)
        self.assertNotIn("<script>", html)
        self.assertNotIn("<img onerror", html)
        self.assertIn("&lt;script&gt;", html)
        self.assertIn("?a=1&amp;b=2", html)
        self.assertIn("In development", html)


if __name__ == "__main__":
    unittest.main()
