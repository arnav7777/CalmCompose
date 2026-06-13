import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "data.js",
  "gemini.js",
  "vercel.json",
];

test("required project files exist", () => {
  for (const file of requiredFiles) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  }
});

test("components folder exists", () => {
  assert.ok(fs.existsSync(path.join(root, "components")));
});
