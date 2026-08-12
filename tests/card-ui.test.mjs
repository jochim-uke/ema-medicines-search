import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

test("medicine cards use pharmacotherapeutic groups and expanded EMA metadata", async () => {
  const app = await readFile(new URL("app.js", root), "utf8");
  assert.match(app, /Pharmakotherapeutische Gruppe/);
  assert.match(app, /Therapeutische Gebiete \(MeSH\)/);
  assert.match(app, /Zulassungsinhaber \/ Antragsteller/);
  assert.match(app, /Datum der Zulassung/);
});

test("the whole card toggles an accessible expanded region", async () => {
  const app = await readFile(new URL("app.js", root), "utf8");
  assert.match(app, /toggle\.className = "medicine__toggle"/);
  assert.match(app, /toggle\.setAttribute\("aria-expanded", "false"\)/);
  assert.match(app, /article\.classList\.toggle\("medicine--open"\)/);
  assert.match(app, /expanded\.hidden = !isOpen/);
});

test("collapsed indications are limited to two lines across the card width", async () => {
  const styles = await readFile(new URL("styles.css", root), "utf8");
  assert.match(styles, /\.medicine__indication-preview \.medicine__indication[^}]+-webkit-line-clamp: 2/s);
  assert.match(styles, /\.medicine__indication-wrap[^}]+border-top/s);
  assert.match(styles, /\.medicine__expand-hint/);
});
