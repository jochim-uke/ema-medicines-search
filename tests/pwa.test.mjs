import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

test("manifest defines a standalone app with required icons", async () => {
  const manifest = JSON.parse(await readFile(new URL("manifest.webmanifest", root), "utf8"));
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./");
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  assert.ok(manifest.icons.some((icon) => icon.purpose === "maskable"));
});

test("page links the manifest and registers the service worker", async () => {
  const [html, app] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("app.js", root), "utf8"),
  ]);
  assert.match(html, /rel="manifest" href="manifest\.webmanifest"/);
  assert.match(html, /rel="apple-touch-icon"/);
  assert.match(app, /serviceWorker\.register\("\.\/service-worker\.js"\)/);
});

test("service worker caches the last valid medicine data", async () => {
  const worker = await readFile(new URL("service-worker.js", root), "utf8");
  assert.match(worker, /\.\/data\/medicines\.json/);
  assert.match(worker, /networkFirst\(request\)/);
});
