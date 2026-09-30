#!/usr/bin/env node
// Builds chromashift.js from the modules in src/.
//
// Spicetify Marketplace and the manual install both load a single file
// (manifest.json -> "main"), so the source is split into modules for
// maintainability and bundled back into one file with this script.
//
//   node build.js          -> regenerates chromashift.js
//   node build.js --check  -> exits 1 if chromashift.js is out of date (CI)

const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "src");
const OUT = path.join(__dirname, "chromashift.js");

// Order matters: the modules share one IIFE scope, so a `const`/`let`
// must be defined before the code that runs it at load time.
const ORDER = [
  "header.js",        // file banner, IIFE open, Spicetify readiness guard
  "utils.js",         // colour helpers
  "presets.js",       // built-in presets + COLOR_DEFS
  "storage-keys.js",  // localStorage keys, community preset URLs
  "cloud.js",         // cloud sync (login / push / pull)
  "storage.js",       // load/save colours, presets, community presets
  "css-inject.js",    // <style> element
  "css-build.js",     // buildCSS() + applyCSS()
  "sbl-compat.js",    // Simple Beautiful Lyrics compatibility
  "topbar.js",        // top bar fixes
  "play-buttons.js",  // play button fixes
  "filter-bar.js",    // Home filter bar
  "fixes-runner.js",  // runAllFixes, DOM observer, applyColors
  "ui-mount.js",      // buildUI(): mounts the section in Settings
  "lang/_head.js",    // KEY_LANG, LANGUAGES, `const TRANSLATIONS = {`
  "lang/en-GB.js",
  "lang/en-US.js",
  "lang/it.js",
  "lang/de.js",
  "lang/fr.js",
  "lang/es.js",
  "lang/uk.js",
  "lang/ru.js",
  "lang/zh.js",
  "lang/_tail.js",    // closes TRANSLATIONS, getLang/setLang/t
  "render-ui.js",     // renderUI(): the Settings panel
  "navigation.js",    // mounts the panel when navigating to Settings
  "auto-updater.js",  // update checker + badge
  "boot.js",          // startup calls
  "footer.js",        // IIFE close
];

const bundle = ORDER.map((f) => fs.readFileSync(path.join(SRC, f), "utf8")).join("");

if (process.argv.includes("--check")) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (current !== bundle) {
    console.error("chromashift.js is out of date. Run: node build.js");
    process.exit(1);
  }
  console.log("chromashift.js is up to date.");
} else {
  fs.writeFileSync(OUT, bundle);
  console.log(`Built chromashift.js (${bundle.split("\n").length - 1} lines from ${ORDER.length} modules)`);
}
