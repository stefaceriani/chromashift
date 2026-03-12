// NAME: ChromaShift
// AUTHOR: stefaceriani
// DESCRIPTION: Personalizza i colori di Spotify dalla pagina Impostazioni.
// VERSION: 1.5.0

(function ChromaShift() {
  "use strict";

  if (!Spicetify?.Platform || !Spicetify?.LocalStorage) {
    setTimeout(ChromaShift, 300);
    return;
  }

  // ═══════════════════════════════════════════════════════════
  // UTILITIES
  // ═══════════════════════════════════════════════════════════

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    const n = parseInt(hex, 16);
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }

  function adjustColor(hex, amount) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);
    r = Math.max(0, Math.min(255, Math.round(r + 255 * amount)));
    g = Math.max(0, Math.min(255, Math.round(g + 255 * amount)));
    b = Math.max(0, Math.min(255, Math.round(b + 255 * amount)));
    return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
  }

  function luminance(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    return [0, 2, 4].reduce((sum, i, idx) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      const lin = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      return sum + lin * [0.2126, 0.7152, 0.0722][idx];
    }, 0);
  }

  function contrastColor(bgHex) {
    return luminance(bgHex) > 0.179 ? "#000000" : "#ffffff";
  }

  function hexToHsl(hex) {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
    let r = parseInt(hex.slice(0, 2), 16) / 255;
    let g = parseInt(hex.slice(2, 4), 16) / 255;
    let b = parseInt(hex.slice(4, 6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return "#" + [0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, "0")).join("");
  }

  function isValidHex(v) {
    return /^#?[0-9A-Fa-f]{6}$/.test(v.trim());
  }

  function normalizeHex(v) {
    v = v.trim().replace(/^#/, "");
    if (v.length === 3) v = v.split("").map(c => c + c).join("");
    return "#" + v.toLowerCase();
  }

  // ═══════════════════════════════════════════════════════════
  // PRESETS
  // ═══════════════════════════════════════════════════════════

  const BUILTIN_PRESETS = {
    default: {
      name: "Spotify Default", emoji: "🟢", builtin: true,
      colors: {
        csText: "#ffffff", csSubtext: "#a7a7a7",
        csMain: "#121212", csMainElevated: "#1a1a1a",
        csHighlight: "#282828", csHighlightElevated: "#3e3e3e",
        csAccent: "#1db954", csPlayButton: "#1db954", csPlayButtonHover: "#1ed760",
        csButtonDisabled: "#535353", csSidebar: "#000000",
        csPlayer: "#121212", csCard: "#181818", csCardHover: "#282828",
        csNotification: "#3d91f4", csProgressBg: "#3e3e3e", csProgressFg: "#1db954", csVolumeBg: "#3e3e3e", csVolumeFg: "#1db954",
      },
    },
    midnight: {
      name: "Midnight Blue", emoji: "🔵", builtin: true,
      colors: {
        csText: "#e8eaf6", csSubtext: "#9fa8da",
        csMain: "#0a0e1a", csMainElevated: "#0f1629",
        csHighlight: "#1a2035", csHighlightElevated: "#253050",
        csAccent: "#5c6bc0", csPlayButton: "#5c6bc0", csPlayButtonHover: "#7986cb",
        csButtonDisabled: "#37474f", csSidebar: "#070b14",
        csPlayer: "#0a0e1a", csCard: "#111827", csCardHover: "#1e2d45",
        csNotification: "#5c6bc0", csProgressBg: "#253050", csProgressFg: "#5c6bc0", csVolumeBg: "#253050", csVolumeFg: "#5c6bc0",
      },
    },
    rose: {
      name: "Rose Gold", emoji: "🌸", builtin: true,
      colors: {
        csText: "#fdf2f8", csSubtext: "#f9a8d4",
        csMain: "#1a0a0f", csMainElevated: "#2a1018",
        csHighlight: "#3d1a25", csHighlightElevated: "#5c2535",
        csAccent: "#e879a0", csPlayButton: "#e879a0", csPlayButtonHover: "#f48fb1",
        csButtonDisabled: "#4a2030", csSidebar: "#110508",
        csPlayer: "#1a0a0f", csCard: "#21101a", csCardHover: "#3d1a2a",
        csNotification: "#e879a0", csProgressBg: "#5c2535", csProgressFg: "#e879a0", csVolumeBg: "#5c2535", csVolumeFg: "#e879a0",
      },
    },
    forest: {
      name: "Forest", emoji: "🌿", builtin: true,
      colors: {
        csText: "#f0fdf4", csSubtext: "#86efac",
        csMain: "#071a0e", csMainElevated: "#0d2615",
        csHighlight: "#163620", csHighlightElevated: "#1e4d2c",
        csAccent: "#22c55e", csPlayButton: "#22c55e", csPlayButtonHover: "#4ade80",
        csButtonDisabled: "#1a3320", csSidebar: "#040f08",
        csPlayer: "#071a0e", csCard: "#0e2117", csCardHover: "#1a3825",
        csNotification: "#22c55e", csProgressBg: "#1e4d2c", csProgressFg: "#22c55e", csVolumeBg: "#1e4d2c", csVolumeFg: "#22c55e",
      },
    },
    cyber: {
      name: "Cyberpunk", emoji: "⚡", builtin: true,
      colors: {
        csText: "#f0f9ff", csSubtext: "#67e8f9",
        csMain: "#050a10", csMainElevated: "#080f18",
        csHighlight: "#0d1a24", csHighlightElevated: "#102030",
        csAccent: "#06b6d4", csPlayButton: "#06b6d4", csPlayButtonHover: "#22d3ee",
        csButtonDisabled: "#0e3040", csSidebar: "#030609",
        csPlayer: "#050a10", csCard: "#091420", csCardHover: "#0e2030",
        csNotification: "#f59e0b", csProgressBg: "#102030", csProgressFg: "#06b6d4", csVolumeBg: "#102030", csVolumeFg: "#f59e0b",
      },
    },
    monochrome: {
      name: "Monochrome", emoji: "⬜", builtin: true,
      colors: {
        csText: "#ffffff", csSubtext: "#bbbbbb",
        csMain: "#0d0d0d", csMainElevated: "#141414",
        csHighlight: "#1f1f1f", csHighlightElevated: "#333333",
        csAccent: "#ffffff", csPlayButton: "#ffffff", csPlayButtonHover: "#dddddd",
        csButtonDisabled: "#555555", csSidebar: "#000000",
        csPlayer: "#0d0d0d", csCard: "#161616", csCardHover: "#2a2a2a",
        csNotification: "#ffffff", csProgressBg: "#333333", csProgressFg: "#ffffff", csVolumeBg: "#333333", csVolumeFg: "#bbbbbb",
      },
    },
    light: {
      name: "Light Mode", emoji: "☀️", builtin: true,
      colors: {
        csText: "#000000", csSubtext: "#6a6a6a",
        csMain: "#ffffff", csMainElevated: "#f0f0f0",
        csHighlight: "#e0e0e0", csHighlightElevated: "#cccccc",
        csAccent: "#1db954", csPlayButton: "#1db954", csPlayButtonHover: "#1ed760",
        csButtonDisabled: "#aaaaaa", csSidebar: "#f5f5f5",
        csPlayer: "#ffffff", csCard: "#f8f8f8", csCardHover: "#ebebeb",
        csNotification: "#3d91f4", csProgressBg: "#cccccc", csProgressFg: "#1db954", csVolumeBg: "#cccccc", csVolumeFg: "#1db954",
      },
    },
  };

  const COLOR_DEFS = [
    { key: "csText",              labelKey: "csText",              group: "groupText" },
    { key: "csSubtext",           labelKey: "csSubtext",           group: "groupText" },
    { key: "csMain",              labelKey: "csMain",              group: "groupBg" },
    { key: "csMainElevated",      labelKey: "csMainElevated",      group: "groupBg" },
    { key: "csHighlight",         labelKey: "csHighlight",         group: "groupBg" },
    { key: "csHighlightElevated", labelKey: "csHighlightElevated", group: "groupBg" },
    { key: "csAccent",            labelKey: "csAccent",            group: "groupAccents" },
    { key: "csPlayButton",        labelKey: "csPlayButton",        group: "groupAccents" },
    { key: "csPlayButtonHover",   labelKey: "csPlayButtonHover",   group: "groupAccents" },
    { key: "csButtonDisabled",    labelKey: "csButtonDisabled",    group: "groupAccents" },
    { key: "csSidebar",           labelKey: "csSidebar",           group: "groupStructure" },
    { key: "csPlayer",            labelKey: "csPlayer",            group: "groupStructure" },
    { key: "csCard",              labelKey: "csCard",              group: "groupStructure" },
    { key: "csCardHover",         labelKey: "csCardHover",         group: "groupStructure" },
    { key: "csNotification",      labelKey: "csNotification",      group: "groupStructure" },
    { key: "csProgressBg",        labelKey: "csProgressBg",        group: "groupPlayer" },
    { key: "csProgressFg",        labelKey: "csProgressFg",        group: "groupPlayer" },
    { key: "csVolumeBg",          labelKey: "csVolumeBg",          group: "groupPlayer" },
    { key: "csVolumeFg",          labelKey: "csVolumeFg",          group: "groupPlayer" },
  ];

  // ═══════════════════════════════════════════════════════════
  // STORAGE
  // ═══════════════════════════════════════════════════════════

  const KEY_COLORS         = "cs4_colors";
  const KEY_PRESET         = "cs4_preset";
  const KEY_CUSTOM_PRESETS = "cs4_custom_presets";

  function loadColors() {
    try {
      const s = Spicetify.LocalStorage.get(KEY_COLORS);
      if (s) return JSON.parse(s);
    } catch (_) {}
    return { ...BUILTIN_PRESETS.default.colors };
  }

  function saveColors(c) {
    Spicetify.LocalStorage.set(KEY_COLORS, JSON.stringify(c));
  }

  function loadPreset() {
    return Spicetify.LocalStorage.get(KEY_PRESET) || "default";
  }

  function savePreset(k) {
    Spicetify.LocalStorage.set(KEY_PRESET, k);
  }

  function loadCustomPresets() {
    try {
      const s = Spicetify.LocalStorage.get(KEY_CUSTOM_PRESETS);
      if (s) return JSON.parse(s);
    } catch (_) {}
    return {};
  }

  function saveCustomPresets(obj) {
    Spicetify.LocalStorage.set(KEY_CUSTOM_PRESETS, JSON.stringify(obj));
  }

  function getAllPresets() {
    return { ...BUILTIN_PRESETS, ...loadCustomPresets() };
  }

  // ═══════════════════════════════════════════════════════════
  // CSS INJECTION
  // ═══════════════════════════════════════════════════════════

  let styleEl = document.getElementById("cs4-style");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "cs4-style";
    document.head.appendChild(styleEl);
  }

  function buildCSS(c) {
    const t        = c.csText              || "#ffffff";
    const sub      = c.csSubtext           || "#a7a7a7";
    const bg       = c.csMain              || "#121212";
    const bgEl     = c.csMainElevated      || "#1a1a1a";
    const hl       = c.csHighlight         || "#282828";
    const hlEl     = c.csHighlightElevated || "#3e3e3e";
    const acc      = c.csAccent            || "#1db954";
    const btn      = luminance(acc) > 0.179 ? adjustColor(acc, -0.15) : adjustColor(acc, 0.15);
    const pbtn     = c.csPlayButton        || acc;
    const pbtnHov  = c.csPlayButtonHover   || adjustColor(pbtn, 0.1);
    const btnD     = c.csButtonDisabled    || "#535353";
    const side     = c.csSidebar           || "#000000";
    const play     = c.csPlayer            || "#121212";
    const card     = c.csCard              || "#181818";
    const cardHov  = c.csCardHover         || adjustColor(card, 0.08);
    const notif    = c.csNotification      || "#3d91f4";
    const progBg   = c.csProgressBg        || hl;
    const progFg   = c.csProgressFg        || acc;
    const volBg    = c.csVolumeBg          || hl;
    const volFg    = c.csVolumeFg          || acc;

    const accActive  = adjustColor(acc, 0.08);
    const btnActive  = adjustColor(btn, 0.08);
    const bgPress    = adjustColor(bg, -0.05);
    const bgTinted   = adjustColor(bg, 0.04);
    const bgTintedHl = adjustColor(bg, 0.09);
    const decorBase  = adjustColor(acc, -0.15);
    const decorSub   = adjustColor(acc, -0.25);
    const pbtnText   = contrastColor(pbtn);
    const btnText    = contrastColor(btn);

    return `
:root,.Root__top-bar,.Root__nav-bar,.Root__main-view,.Root__now-playing-bar,
.Root__globalNav,.main-view-container,[class*="main-view"],[class*="Root__"]{
  --spice-text:${t}!important;--spice-subtext:${sub}!important;
  --spice-extratext:${sub}!important;--spice-main:${bg}!important;
  --spice-main-elevated:${bgEl}!important;--spice-main-transition:${bg}!important;
  --spice-highlight:${hl}!important;--spice-highlight-elevated:${hlEl}!important;
  --spice-sidebar:${side}!important;--spice-player:${play}!important;
  --spice-card:${card}!important;--spice-button:${btn}!important;
  --spice-button-active:${btnActive}!important;--spice-button-disabled:${btnD}!important;
  --spice-accent:${acc}!important;--spice-accent-active:${accActive}!important;
  --spice-tab-active:${side}!important;--spice-notification:${notif}!important;
  --spice-notification-error:#e5534b!important;--spice-misc:${hl}!important;
  --spice-shadow:rgba(0,0,0,.5)!important;
  --spice-rgb-text:${hexToRgb(t)}!important;--spice-rgb-subtext:${hexToRgb(sub)}!important;
  --spice-rgb-main:${hexToRgb(bg)}!important;--spice-rgb-main-elevated:${hexToRgb(bgEl)}!important;
  --spice-rgb-highlight:${hexToRgb(hl)}!important;--spice-rgb-highlight-elevated:${hexToRgb(hlEl)}!important;
  --spice-rgb-sidebar:${hexToRgb(side)}!important;--spice-rgb-player:${hexToRgb(play)}!important;
  --spice-rgb-card:${hexToRgb(card)}!important;--spice-rgb-button:${hexToRgb(btn)}!important;
  --spice-rgb-button-active:${hexToRgb(btnActive)}!important;
  --spice-rgb-accent:${hexToRgb(acc)}!important;--spice-rgb-notification:${hexToRgb(notif)}!important;
}
:root,[class*="encore-"]{
  --encore-base-color-text-base:${t}!important;
  --encore-base-color-text-subdued:${sub}!important;
  --encore-base-color-text-bright-accent:${acc}!important;
  --encore-base-color-text-negative:#e5534b!important;
  --encore-base-color-text-warning:#e8740c!important;
  --encore-base-color-text-positive:${acc}!important;
  --encore-base-color-text-announcement:${notif}!important;
  --encore-base-color-background-base:${bg}!important;
  --encore-base-color-background-highlight:${hl}!important;
  --encore-base-color-background-press:${bgPress}!important;
  --encore-base-color-background-elevated-base:${bgEl}!important;
  --encore-base-color-background-elevated-highlight:${hlEl}!important;
  --encore-base-color-background-tinted-base:${bgTinted}!important;
  --encore-base-color-background-tinted-highlight:${bgTintedHl}!important;
  --encore-base-color-background-unsafe-for-small-text-base:${bg}!important;
  --encore-base-color-background-unsafe-for-small-text-highlight:${hl}!important;
  --encore-base-color-essential-base:${t}!important;
  --encore-base-color-essential-subdued:${sub}!important;
  --encore-base-color-essential-bright-accent:${acc}!important;
  --encore-base-color-essential-negative:#e5534b!important;
  --encore-base-color-essential-warning:#e8740c!important;
  --encore-base-color-essential-positive:${acc}!important;
  --encore-base-color-essential-announcement:${notif}!important;
  --encore-base-color-decorative-base:${decorBase}!important;
  --encore-base-color-decorative-subdued:${decorSub}!important;
  --encore-color-text-base:${t}!important;
  --encore-color-text-subdued:${sub}!important;
  --encore-color-text-bright-accent:${acc}!important;
  --encore-color-text-negative:#e5534b!important;
  --encore-color-text-positive:${acc}!important;
  --encore-color-text-warning:#e8740c!important;
  --encore-color-text-announcement:${notif}!important;
  --encore-color-background-base:${bg}!important;
  --encore-color-background-highlight:${hl}!important;
  --encore-color-background-press:${bgPress}!important;
  --encore-color-background-elevated-base:${bgEl}!important;
  --encore-color-background-elevated-highlight:${hlEl}!important;
  --encore-color-background-tinted-base:${bgTinted}!important;
  --encore-color-background-tinted-highlight:${bgTintedHl}!important;
  --encore-color-essential-base:${t}!important;
  --encore-color-essential-subdued:${sub}!important;
  --encore-color-essential-bright-accent:${acc}!important;
  --encore-color-essential-negative:#e5534b!important;
  --encore-color-essential-positive:${acc}!important;
  --encore-color-decorative-base:${decorBase}!important;
  --encore-color-decorative-subdued:${decorSub}!important;
}
.Root__nav-bar,.nav-bar,[class*="navBar"],[class*="sidebar"],
.LayoutResizer__resize-bar+*{background-color:${side}!important}
body:not(.cs4-sbl-active) .Root__main-view,
body:not(.cs4-sbl-active) .main-view-container__scroll-node,
body:not(.cs4-sbl-active) [class*="contentSpacing"]{background-color:${bg}!important}
body.cs4-sbl-active .Root__main-view:not(:has(.lyrics-lyrics-container)),
body.cs4-sbl-active .main-view-container__scroll-node:not(:has(.lyrics-lyrics-container)),
body.cs4-sbl-active [class*="contentSpacing"]:not(:has(.lyrics-lyrics-container)){background-color:${bg}!important}
.Root__now-playing-bar,.now-playing-bar,[class*="nowPlayingBar"],
footer{background-color:${play}!important}

/* ── Top bar: solid su tutte le pagine (override via JS per home) ── */
.Root__top-bar{
  background-color:${bg}!important;
  background-image:none!important;
  box-shadow:none!important;
}
.main-topBar-container,
[data-testid="topbar-background"],
[class*="topBar__background"],
[class*="topBarBackground"],
.main-topBar-background,
[class*="topBar__overlay"],
[class*="topBarOverlay"]{
  background-color:${bg}!important;
  background-image:none!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
  box-shadow:none!important;
}

/* ── Progress bar (playback) ── */
[data-testid="progress-bar"]{cursor:pointer}
.x-progressBar-background{background-color:${progBg}!important;height:4px!important;border-radius:2px!important}
.x-progressBar-middleground{background-color:${progBg}!important}
.x-progressBar-foreground{background-color:${progFg}!important;height:4px!important;border-radius:2px!important;min-width:2px!important}
.x-progressBar-handle{background-color:${progFg}!important;width:12px!important;height:12px!important;border-radius:50%!important;opacity:0!important;transition:opacity .1s!important}
[data-testid="progress-bar"]:hover .x-progressBar-handle{opacity:1!important}

/* ── Volume bar ── */
[data-testid="volume-bar"] .x-progressBar-background,
[data-testid="volume-bar"] ~ * .x-progressBar-background,
[class*="volume"] .x-progressBar-background{background-color:${volBg}!important}
[data-testid="volume-bar"] .x-progressBar-foreground,
[data-testid="volume-bar"] ~ * .x-progressBar-foreground,
[class*="volume"] .x-progressBar-foreground{background-color:${volFg}!important;transition:background-color .15s!important}
[data-testid="volume-bar"]:hover .x-progressBar-foreground,
[class*="volume"]:hover .x-progressBar-foreground{background-color:${adjustColor(volFg, 0.1)}!important}
[data-testid="volume-bar"] .x-progressBar-handle,
[class*="volume"] .x-progressBar-handle{background-color:${volFg}!important}

/* ── TUTTI i play button cerchi: invisibili a riposo, visibili solo al hover del genitore ── */
/* Regola globale: qualsiasi .main-playButton-PlayButton o [data-testid="play-button"]
   che NON sia nella player bar e NON sia nella tracklist → nascosto di default */
.main-playButton-PlayButton:not([data-testid="control-button-playpause"]),
[data-testid="play-button"]{
  opacity:0!important;
  background-color:transparent!important;
  box-shadow:none!important;
  transform:scale(.85)!important;
  pointer-events:none!important;
  transition:opacity .15s,transform .15s!important;
}
/* Hover sul genitore diretto o indiretto → visibile */
*:hover > .main-playButton-PlayButton,
*:hover > [data-testid="play-button"],
*:hover .main-playButton-PlayButton,
*:hover [data-testid="play-button"]{
  opacity:1!important;
  transform:scale(1)!important;
  pointer-events:all!important;
}

/* ── Home: nascondi il cerchio colorato dei play button su TUTTE le card a riposo ── */
/* Copre sia le card grandi che le card rettangolari compatte (shortcut recently played) */
/* Forza background trasparente su TUTTI i play button della home tranne player bar e actionBar */
[data-testid="home-page"] .main-playButton-PlayButton:not([data-testid="control-button-playpause"]),
[data-testid="home-page"] [data-testid="play-button"]{
  background-color:transparent!important;
  box-shadow:none!important;
}
/* Player bar play/pause: sempre visibile con colore accento */
[data-testid="control-button-playpause"]{
  background-color:${pbtn}!important;color:${pbtnText}!important;
  border-radius:50%!important;border:none!important;
  opacity:1!important;transform:none!important;pointer-events:auto!important;
}
[data-testid="control-button-playpause"]:hover{
  background-color:${pbtnHov}!important;
}
[data-testid="control-button-playpause"] svg{
  fill:${pbtnText}!important;color:${pbtnText}!important;
}
/* Header playlist/album play button: visibile sempre con accento */
.main-actionBar-ActionBar .main-playButton-PlayButton,
.main-actionBar-ActionBar [data-testid="play-button"],
[class*="actionBar"] .main-playButton-PlayButton,
[class*="actionBar"] [data-testid="play-button"],
[class*="ActionBar"] .main-playButton-PlayButton,
[class*="ActionBar"] [data-testid="play-button"],
[class*="entityHeader"] .main-playButton-PlayButton,
[class*="entityHeader"] [data-testid="play-button"],
[class*="EntityHeader"] .main-playButton-PlayButton,
[class*="EntityHeader"] [data-testid="play-button"]{
  background-color:${pbtn}!important;color:${pbtnText}!important;
  border-radius:50%!important;border:none!important;
  opacity:1!important;transform:none!important;pointer-events:none!important;
}
[class*="actionBar"] .main-playButton-PlayButton svg,
[class*="ActionBar"] .main-playButton-PlayButton svg,
[class*="entityHeader"] .main-playButton-PlayButton svg,
[class*="EntityHeader"] .main-playButton-PlayButton svg{
  fill:${pbtnText}!important;color:${pbtnText}!important;
}
/* Hover colore separato su card e actionBar play button */
[class*="actionBar"] .main-playButton-PlayButton:hover,
[class*="ActionBar"] .main-playButton-PlayButton:hover,
[class*="entityHeader"] .main-playButton-PlayButton:hover,
[class*="EntityHeader"] .main-playButton-PlayButton:hover,
*:hover > .main-playButton-PlayButton:hover,
*:hover .main-playButton-PlayButton:hover,
*:hover > [data-testid="play-button"]:hover,
*:hover [data-testid="play-button"]:hover{
  background-color:${pbtnHov}!important;
}

[class*="heart"][aria-checked="true"],[class*="follow"][data-encore-id][class*="active"],
[class*="Button--is-active"]{color:${acc}!important}

/* ── Card backgrounds ── */
.main-card-card,[class*="CardComponent"],
[data-testid="card-container"]{background-color:${card}!important;transition:background-color .2s,transform .18s,box-shadow .2s!important}
.main-card-card:hover,[class*="CardComponent"]:hover,
[data-testid="card-container"]:hover,[class*="gridItem"]:hover [data-testid="card-container"],
[class*="gridItem"]:hover [class*="CardComponent"]{background-color:${cardHov}!important;
transform:translateY(-3px) scale(1.013)!important;box-shadow:0 8px 28px rgba(0,0,0,.45)!important}
[class*="gridItem"]:hover [data-testid="card-container"] *,
[class*="gridItem"]:hover [class*="CardComponent"] *{transform:none!important}

/* ── Card description tooltip/overlay: trasparente ── */
[class*="cardDescription"],[class*="CardDescription"],
[class*="card-description"],[class*="cardFooter"],[class*="CardFooter"],
[data-testid="card-container"] [class*="description"],
[data-testid="card-container"] footer,
.main-card-card [class*="description"],
.main-card-card footer{
  background-color:transparent!important;
  background:transparent!important;
}

/* ── Filter bar: trasparente di default, --background-base neutralizzata ── */
.main-home-filterChipsContainer,.main-home-filterChipsSection,
[class*="filterChips"],[class*="FilterChips"],
[data-testid="filter-bar"],[data-testid="filterBar"]{
  --background-base:transparent!important;
  background-color:transparent!important;
  background:transparent!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
  box-shadow:none!important;
}

/* ── Tracklist rows ── */
[class*="TrackListRow"]:hover,[class*="tracklist-row"]:hover,
.main-trackList-trackListRow:hover{background-color:${hl}!important}
[class*="TrackListRow"][aria-selected="true"],
.main-trackList-trackListRow[aria-selected="true"]{background-color:${hlEl}!important}
[class*="contextMenu"],[class*="ContextMenu"],
[data-testid*="context-menu"]{background-color:${bgEl}!important}

/* ── Text ── */
[class*="Type__"],[class*="encore-text"],.main-trackList-rowTitle,
.main-trackList-rowSectionStart{color:${t}!important}
[class*="encore-text-subdued"],[class*="Type__subdued"],
.main-trackList-rowSubTitle,
[data-testid="tracklist-row"] [class*="encore-text"]:not([class*="bold"]){color:${sub}!important}

/* ── Equalizer variables ── */
:root,[class*="Root__"]{
  --spice-equalizer:${acc}!important;
  --progress-bar-color:${acc}!important;
  --progress-bar-handle-color:${acc}!important;
}

/* ── Tracklist icon accent ── */
.main-trackList-trackListRow:hover .main-trackList-rowSectionIndex svg,
[data-testid="tracklist-row"]:hover [class*="rowIndex"] svg,
[data-testid="queue-row"]:hover [class*="trackNumber"] svg,
[data-testid="queue-row"][aria-current] [class*="trackNumber"] svg{
  color:${acc}!important;fill:${acc}!important}

/* ── ButtonPrimary ── */
[class*="ButtonPrimary"]:not([class*="play"]):not([data-testid*="play"]),
[data-encore-id="buttonPrimary"]:not([class*="play"]):not([data-testid*="play"]){
  background-color:${btn}!important;color:${btnText}!important;border-radius:500px!important}
[class*="ButtonPrimary"]:not([class*="play"]):hover,
[data-encore-id="buttonPrimary"]:not([class*="play"]):hover{background-color:${btnActive}!important}

::-webkit-scrollbar{width:8px!important}
::-webkit-scrollbar-track{background:${bg}!important}
::-webkit-scrollbar-thumb{background:${hl}!important;border-radius:4px!important}
::-webkit-scrollbar-thumb:hover{background:${hlEl}!important}
`;
  }

  function applyCSS(colors) { styleEl.textContent = buildCSS(colors); }

  // ═══════════════════════════════════════════════════════════
  // SIMPLE BEAUTIFUL LYRICS COMPATIBILITY
  // ═══════════════════════════════════════════════════════════
  // SBL uses .lyrics-lyrics-container as its root and paints the background
  // via --lyrics-color-background on .lyrics-lyrics-background.
  // ChromaShift must not set background-color on any ancestor of that container
  // while the lyrics view is open. We do this by toggling a class on <body>
  // and using a CSS :has() guard in buildCSS.

  const SBL_BODY_CLASS = "cs4-sbl-active";

  function sblCheck() {
    if (document.querySelector(".lyrics-lyrics-container")) {
      document.body.classList.add(SBL_BODY_CLASS);
    } else {
      document.body.classList.remove(SBL_BODY_CLASS);
    }
  }

  // Run immediately and on every DOM change
  sblCheck();
  new MutationObserver(sblCheck).observe(document.body, { childList: true, subtree: true });

  let _liveColors = loadColors();

  function isHomePage() {
    return !!(
      document.querySelector("[data-testid='home-page']") ||
      window.location.pathname === "/" ||
      window.location.pathname === "/home"
    );
  }

  // Topbar selectors Spotify uses
  const TOPBAR_SELS = [
    ".Root__top-bar",
    ".main-topBar-container",
    ".main-topBar-background",
    "[data-testid='topbar-background']",
  ];

  function fixTopBar() {
    const bg = _liveColors.csMain || "#121212";
    const onHome = isHomePage();
    TOPBAR_SELS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (onHome) {
          // Home: forza trasparenza rimuovendo inline e sovrascrivendo
          el.style.setProperty("background-color", "transparent", "important");
          el.style.setProperty("background-image", "none", "important");
          el.style.setProperty("background", "transparent", "important");
          el.style.setProperty("box-shadow", "none", "important");
          el.style.setProperty("backdrop-filter", "none", "important");
          el.style.setProperty("-webkit-backdrop-filter", "none", "important");
        } else {
          el.style.setProperty("background-color", bg, "important");
          el.style.setProperty("background-image", "none", "important");
          el.style.setProperty("background", bg, "important");
          el.style.setProperty("box-shadow", "none", "important");
          el.style.setProperty("backdrop-filter", "none", "important");
          el.style.setProperty("-webkit-backdrop-filter", "none", "important");
        }
      });
    });
  }

  // Dedicated observer for topbar inline style injection (Spotify injects on scroll)
  let _topBarObserver = null;
  function attachTopBarObserver() {
    if (_topBarObserver) { _topBarObserver.disconnect(); _topBarObserver = null; }
    TOPBAR_SELS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const obs = new MutationObserver(() => {
          clearTimeout(obs._t);
          obs._t = setTimeout(fixTopBar, 16);
        });
        obs.observe(el, { attributes: true, attributeFilter: ["style"] });
        if (!_topBarObserver) _topBarObserver = obs;
      });
    });
  }

  function fixPlayButtons() {
    const pbtn      = _liveColors.csPlayButton     || _liveColors.csButton || "#1db954";
    const pbtnHov   = _liveColors.csPlayButtonHover || adjustColor(pbtn, 0.1);
    const pbtnText  = contrastColor(pbtn);

    // ── Player bar play/pause ──
    document.querySelectorAll("[data-testid='control-button-playpause']").forEach(btn => {
      btn.style.setProperty("background-color", pbtn, "important");
      btn.style.setProperty("color", pbtnText, "important");
      btn.style.setProperty("border-radius", "50%", "important");
      btn.querySelectorAll("svg,path,polygon").forEach(el => {
        el.style.setProperty("fill", pbtnText, "important");
        el.style.setProperty("color", pbtnText, "important");
      });
      if (!btn.dataset.cs4Hooked) {
        btn.dataset.cs4Hooked = "1";
        btn.addEventListener("mouseenter", () => btn.style.setProperty("background-color", pbtnHov, "important"));
        btn.addEventListener("mouseleave", () => btn.style.setProperty("background-color", pbtn, "important"));
      }
    });

    document.querySelectorAll(".main-playButton-PlayButton,[data-testid='play-button']").forEach(btn => {
      // Skip tracklist rows e player bar
      if (
        btn.closest("[class*='TrackListRow']") || btn.closest("[class*='tracklist-row']") ||
        btn.closest(".main-trackList-trackListRow") || btn.closest("[data-testid='tracklist-row']") ||
        btn.closest("[data-testid='queue-row']") || btn.closest("[class*='QueueRow']") ||
        btn.dataset.testid === "control-button-playpause"
      ) return;

      // Colore testo/svg su tutti
      btn.style.setProperty("color", pbtnText, "important");
      btn.querySelectorAll("svg,path,polygon").forEach(el => {
        el.style.setProperty("fill", pbtnText, "important");
        el.style.setProperty("color", pbtnText, "important");
      });

      // ActionBar/EntityHeader: sempre visibile con colore fisso, hover via JS
      if (
        btn.closest("[class*='actionBar']") || btn.closest("[class*='ActionBar']") ||
        btn.closest("[class*='entityHeader']") || btn.closest("[class*='EntityHeader']")
      ) {
        btn.style.setProperty("background-color", pbtn, "important");
        btn.style.setProperty("border-radius", "50%", "important");
        if (!btn.dataset.cs4Hooked) {
          btn.dataset.cs4Hooked = "1";
          btn.addEventListener("mouseenter", () => btn.style.setProperty("background-color", pbtnHov, "important"));
          btn.addEventListener("mouseleave", () => btn.style.setProperty("background-color", pbtn, "important"));
        }
        return;
      }

      // Card play button: NON impostare background a riposo (CSS gestisce opacity/visibilità)
      // Solo hook sul genitore per mostrare il colore quando la card è in hover
      btn.style.removeProperty("background-color");
      btn.style.setProperty("border-radius", "50%", "important");

      if (!btn.dataset.cs4Hooked) {
        btn.dataset.cs4Hooked = "1";
        const cardAnchor =
          btn.closest(".main-card-card") ||
          btn.closest("[class*='CardComponent']") ||
          btn.closest("[data-testid='card-container']") ||
          btn.closest("[data-testid='shortcut']") ||
          btn.closest("[class*='shortcut']") ||
          btn.closest("[class*='Shortcut']") ||
          btn.closest("[class*='recentlyPlayed']") ||
          btn.closest("[class*='RecentlyPlayed']") ||
          btn.closest("[class*='gridItem']") ||
          btn.parentElement;
        if (cardAnchor) {
          cardAnchor.addEventListener("mouseenter", () => {
            btn.style.setProperty("background-color", pbtn, "important");
          });
          cardAnchor.addEventListener("mouseleave", () => {
            btn.style.removeProperty("background-color");
          });
          // Hover diretto sul bottone → colore hover
          btn.addEventListener("mouseenter", () => btn.style.setProperty("background-color", pbtnHov, "important"));
          btn.addEventListener("mouseleave", () => btn.style.setProperty("background-color", pbtn, "important"));
        }
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // FILTER BAR (Home): trasparente a riposo, solida su scroll
  // ═══════════════════════════════════════════════════════════

  const FILTER_SELS = [
    ".main-home-filterChipsContainer",
    ".main-home-filterChipsSection",
    "[class*='filterChips']",
    "[class*='FilterChips']",
    "[data-testid='filter-bar']",
    "[data-testid='filterBar']",
  ];

  let _filterScrollListener = null;
  let _filterScrollEl       = null;

  function applyFilterBarStyle(scrolled) {
    const bgEl = _liveColors.csMainElevated || "#1a1a1a";
    FILTER_SELS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!scrolled) {
          el.style.setProperty("--background-base", "transparent");
          el.style.setProperty("background-color", "transparent", "important");
          el.style.setProperty("background",       "transparent", "important");
          el.style.setProperty("backdrop-filter",  "none",        "important");
          el.style.setProperty("-webkit-backdrop-filter", "none", "important");
          el.style.setProperty("box-shadow",       "none",        "important");
        } else {
          el.style.setProperty("--background-base", bgEl);
          el.style.setProperty("background-color", bgEl, "important");
          el.style.setProperty("background",       bgEl, "important");
          el.style.setProperty("box-shadow",       "0 2px 8px rgba(0,0,0,.45)", "important");
          el.style.removeProperty("backdrop-filter");
          el.style.removeProperty("-webkit-backdrop-filter");
        }
      });
    });
  }

  function attachFilterScrollObserver() {
    if (!isHomePage()) return;

    const scrollEl =
      document.querySelector(".main-view-container__scroll-node") ||
      document.querySelector("[class*='scrollNode']") ||
      document.querySelector(".os-viewport");
    if (!scrollEl) return;

    if (_filterScrollEl && _filterScrollEl !== scrollEl && _filterScrollListener) {
      _filterScrollEl.removeEventListener("scroll", _filterScrollListener);
      _filterScrollEl = null;
      _filterScrollListener = null;
    }
    if (_filterScrollEl === scrollEl) return;

    _filterScrollEl = scrollEl;
    applyFilterBarStyle(false);

    _filterScrollListener = () => {
      applyFilterBarStyle(scrollEl.scrollTop > 10);
    };
    scrollEl.addEventListener("scroll", _filterScrollListener, { passive: true });
  }

  function fixFilterBar() {
    if (isHomePage()) {
      applyFilterBarStyle(false);
      attachFilterScrollObserver();
      // Osserva re-injection stili inline sulla filter bar (come topbar)
      FILTER_SELS.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          if (el.dataset.cs4FilterHooked) return;
          el.dataset.cs4FilterHooked = "1";
          const obs = new MutationObserver((mutations) => {
            // Ignora se Spotify sta solo animando opacity (fade-in iniziale)
            const onlyOpacity = mutations.every(m =>
              m.type === "attributes" && m.attributeName === "style" &&
              el.style.opacity !== "" && !el.style.backgroundImage &&
              el.style.cssText.replace(/opacity[^;]+;?/g, "").trim() === ""
            );
            if (onlyOpacity) return;
            const scrolled = _filterScrollEl ? _filterScrollEl.scrollTop > 10 : false;
            applyFilterBarStyle(scrolled);
          });
          obs.observe(el, { attributes: true, attributeFilter: ["style", "class"] });
        });
      });
    }
  }

  function runAllFixes() { fixTopBar(); fixPlayButtons(); fixFilterBar(); attachTopBarObserver(); applySBLFix(); }

  const domObserver = new MutationObserver(() => {
    clearTimeout(domObserver._t);
    domObserver._t = setTimeout(runAllFixes, 80);
  });
  domObserver.observe(document.body, { childList: true, subtree: true, attributes: false });

  function applyColors(colors) {
    _liveColors = colors;
    applyCSS(colors);
    setTimeout(runAllFixes, 50);
  }

  // ═══════════════════════════════════════════════════════════
  // UI
  // ═══════════════════════════════════════════════════════════

  const SECTION_ID = "cs4-section";

  function buildUI() {
    if (document.getElementById(SECTION_ID)) return;

    const isSettings =
      window.location.pathname.startsWith("/preferences") ||
      window.location.hash.includes("preferences") ||
      !!document.querySelector('[data-testid="settings-page"]') ||
      !!document.querySelector(".x-settings-container");
    if (!isSettings) return;

    const target =
      document.querySelector(".x-settings-container") ||
      document.querySelector('[data-testid="settings-page"]') ||
      document.querySelector(".main-view-container__scroll-node-child");
    if (!target) return;

    const section = document.createElement("div");
    section.id = SECTION_ID;
    target.appendChild(section);
    renderUI(section);
  }

  // ═══════════════════════════════════════════════════════════
  // I18N
  // ═══════════════════════════════════════════════════════════

  const KEY_LANG = "cs4_lang";

  const LANGUAGES = [
    { code: "en-GB", flag: "🇬🇧", name: "English (UK)" },
    { code: "en-US", flag: "🇺🇸", name: "English (US)" },
    { code: "it",    flag: "🇮🇹", name: "Italiano" },
    { code: "de",    flag: "🇩🇪", name: "Deutsch" },
    { code: "fr",    flag: "🇫🇷", name: "Français" },
    { code: "es",    flag: "🇪🇸", name: "Español" },
    { code: "uk",    flag: "🇺🇦", name: "Українська" },
    { code: "ru",    flag: "🇷🇺", name: "Русский" },
    { code: "zh",    flag: "🇨🇳", name: "中文" },
  ];

  const TRANSLATIONS = {
    "en-GB": {
      subtitle:       "Customise every Spotify colour in real time",
      tabPresets:     "Presets",
      tabEditor:      "Colour editor",
      saveBtn:        "＋ Save current",
      presetNamePh:   "Custom preset name…",
      applyBtn:       "✓ Apply & Save",
      resetBtn:       "↺ Restore preset",
      defaultBtn:     "↩ Spotify Default",
      toastSaved:     "Saved and applied!",
      toastReset:     "Restored to active preset.",
      toastDefault:   "Spotify default restored.",
      toastNoName:    "Enter a name.",
      toastPresetSaved: (n) => `Preset "${n}" saved!`,
      toastPresetApplied: (n) => `"${n}" applied!`,
      toastPresetDeleted: "Preset deleted.",
      groupText:      "Text",
      groupBg:        "Backgrounds",
      groupAccents:   "Accents",
      groupStructure: "Structure",
      groupPlayer:    "Player",
      langLabel:      "Language",
      colorLabels: {
        csText: "Main text", csSubtext: "Secondary text",
        csMain: "Main background", csMainElevated: "Elevated background",
        csHighlight: "Hover / selection", csHighlightElevated: "Elevated hover",
        csAccent: "Accent", csPlayButton: "Play button",
        csPlayButtonHover: "Play button (hover)", csButtonDisabled: "Disabled button",
        csSidebar: "Sidebar", csPlayer: "Player bar",
        csCard: "Card", csCardHover: "Card hover",
        csNotification: "Notifications",
        csProgressBg: "Progress background", csProgressFg: "Progress colour",
        csVolumeBg: "Volume background", csVolumeFg: "Volume colour",
      },
    },
    "en-US": {
      subtitle:       "Customize every Spotify color in real time",
      tabPresets:     "Presets",
      tabEditor:      "Color editor",
      saveBtn:        "＋ Save current",
      presetNamePh:   "Custom preset name…",
      applyBtn:       "✓ Apply & Save",
      resetBtn:       "↺ Restore preset",
      defaultBtn:     "↩ Spotify Default",
      toastSaved:     "Saved and applied!",
      toastReset:     "Restored to active preset.",
      toastDefault:   "Spotify default restored.",
      toastNoName:    "Enter a name.",
      toastPresetSaved: (n) => `Preset "${n}" saved!`,
      toastPresetApplied: (n) => `"${n}" applied!`,
      toastPresetDeleted: "Preset deleted.",
      groupText:      "Text",
      groupBg:        "Backgrounds",
      groupAccents:   "Accents",
      groupStructure: "Structure",
      groupPlayer:    "Player",
      langLabel:      "Language",
      colorLabels: {
        csText: "Main text", csSubtext: "Secondary text",
        csMain: "Main background", csMainElevated: "Elevated background",
        csHighlight: "Hover / selection", csHighlightElevated: "Elevated hover",
        csAccent: "Accent", csPlayButton: "Play button",
        csPlayButtonHover: "Play button (hover)", csButtonDisabled: "Disabled button",
        csSidebar: "Sidebar", csPlayer: "Player bar",
        csCard: "Card", csCardHover: "Card hover",
        csNotification: "Notifications",
        csProgressBg: "Progress background", csProgressFg: "Progress color",
        csVolumeBg: "Volume background", csVolumeFg: "Volume color",
      },
    },
    "it": {
      subtitle:       "Personalizza ogni colore di Spotify in tempo reale",
      tabPresets:     "Preset",
      tabEditor:      "Editor colori",
      saveBtn:        "＋ Salva corrente",
      presetNamePh:   "Nome preset personalizzato…",
      applyBtn:       "✓ Applica & Salva",
      resetBtn:       "↺ Ripristina preset",
      defaultBtn:     "↩ Default Spotify",
      toastSaved:     "Salvato e applicato!",
      toastReset:     "Ripristinato al preset attivo.",
      toastDefault:   "Default Spotify ripristinato.",
      toastNoName:    "Inserisci un nome.",
      toastPresetSaved: (n) => `Preset "${n}" salvato!`,
      toastPresetApplied: (n) => `"${n}" applicato!`,
      toastPresetDeleted: "Preset eliminato.",
      groupText:      "Testo",
      groupBg:        "Sfondi",
      groupAccents:   "Accenti",
      groupStructure: "Struttura",
      groupPlayer:    "Player",
      langLabel:      "Lingua",
      colorLabels: {
        csText: "Testo principale", csSubtext: "Testo secondario",
        csMain: "Sfondo principale", csMainElevated: "Sfondo elevato",
        csHighlight: "Hover / selezione", csHighlightElevated: "Hover elevato",
        csAccent: "Accento", csPlayButton: "Tasto Play",
        csPlayButtonHover: "Tasto Play (hover)", csButtonDisabled: "Bottone disabilitato",
        csSidebar: "Sidebar", csPlayer: "Player bar",
        csCard: "Card", csCardHover: "Card hover",
        csNotification: "Notifiche",
        csProgressBg: "Avanzamento sfondo", csProgressFg: "Avanzamento colore",
        csVolumeBg: "Volume sfondo", csVolumeFg: "Volume colore",
      },
    },
    "de": {
      subtitle:       "Passe jede Spotify-Farbe in Echtzeit an",
      tabPresets:     "Voreinstellungen",
      tabEditor:      "Farb-Editor",
      saveBtn:        "＋ Aktuell speichern",
      presetNamePh:   "Name der Voreinstellung…",
      applyBtn:       "✓ Anwenden & Speichern",
      resetBtn:       "↺ Voreinstellung wiederherstellen",
      defaultBtn:     "↩ Spotify-Standard",
      toastSaved:     "Gespeichert und angewendet!",
      toastReset:     "Aktive Voreinstellung wiederhergestellt.",
      toastDefault:   "Spotify-Standard wiederhergestellt.",
      toastNoName:    "Bitte einen Namen eingeben.",
      toastPresetSaved: (n) => `Voreinstellung "${n}" gespeichert!`,
      toastPresetApplied: (n) => `"${n}" angewendet!`,
      toastPresetDeleted: "Voreinstellung gelöscht.",
      groupText:      "Text",
      groupBg:        "Hintergründe",
      groupAccents:   "Akzente",
      groupStructure: "Struktur",
      groupPlayer:    "Player",
      langLabel:      "Sprache",
      colorLabels: {
        csText: "Haupttext", csSubtext: "Sekundärtext",
        csMain: "Haupthintergrund", csMainElevated: "Erhöhter Hintergrund",
        csHighlight: "Hover / Auswahl", csHighlightElevated: "Erhöhter Hover",
        csAccent: "Akzent", csPlayButton: "Play-Taste",
        csPlayButtonHover: "Play-Taste (Hover)", csButtonDisabled: "Deaktivierte Schaltfläche",
        csSidebar: "Seitenleiste", csPlayer: "Player-Leiste",
        csCard: "Karte", csCardHover: "Karten-Hover",
        csNotification: "Benachrichtigungen",
        csProgressBg: "Fortschritt Hintergrund", csProgressFg: "Fortschritt Farbe",
        csVolumeBg: "Lautstärke Hintergrund", csVolumeFg: "Lautstärke Farbe",
      },
    },
    "fr": {
      subtitle:       "Personnalisez chaque couleur de Spotify en temps réel",
      tabPresets:     "Préréglages",
      tabEditor:      "Éditeur de couleurs",
      saveBtn:        "＋ Sauvegarder",
      presetNamePh:   "Nom du préréglage…",
      applyBtn:       "✓ Appliquer & Sauvegarder",
      resetBtn:       "↺ Restaurer le préréglage",
      defaultBtn:     "↩ Défaut Spotify",
      toastSaved:     "Sauvegardé et appliqué !",
      toastReset:     "Préréglage actif restauré.",
      toastDefault:   "Défaut Spotify restauré.",
      toastNoName:    "Veuillez entrer un nom.",
      toastPresetSaved: (n) => `Préréglage "${n}" sauvegardé !`,
      toastPresetApplied: (n) => `"${n}" appliqué !`,
      toastPresetDeleted: "Préréglage supprimé.",
      groupText:      "Texte",
      groupBg:        "Arrière-plans",
      groupAccents:   "Accents",
      groupStructure: "Structure",
      groupPlayer:    "Lecteur",
      langLabel:      "Langue",
      colorLabels: {
        csText: "Texte principal", csSubtext: "Texte secondaire",
        csMain: "Arrière-plan principal", csMainElevated: "Arrière-plan élevé",
        csHighlight: "Survol / sélection", csHighlightElevated: "Survol élevé",
        csAccent: "Accent", csPlayButton: "Bouton lecture",
        csPlayButtonHover: "Bouton lecture (survol)", csButtonDisabled: "Bouton désactivé",
        csSidebar: "Barre latérale", csPlayer: "Barre du lecteur",
        csCard: "Carte", csCardHover: "Survol carte",
        csNotification: "Notifications",
        csProgressBg: "Fond progression", csProgressFg: "Couleur progression",
        csVolumeBg: "Fond volume", csVolumeFg: "Couleur volume",
      },
    },
    "es": {
      subtitle:       "Personaliza cada color de Spotify en tiempo real",
      tabPresets:     "Preajustes",
      tabEditor:      "Editor de colores",
      saveBtn:        "＋ Guardar actual",
      presetNamePh:   "Nombre del preajuste…",
      applyBtn:       "✓ Aplicar y guardar",
      resetBtn:       "↺ Restaurar preajuste",
      defaultBtn:     "↩ Predeterminado Spotify",
      toastSaved:     "¡Guardado y aplicado!",
      toastReset:     "Preajuste activo restaurado.",
      toastDefault:   "Predeterminado de Spotify restaurado.",
      toastNoName:    "Introduce un nombre.",
      toastPresetSaved: (n) => `¡Preajuste "${n}" guardado!`,
      toastPresetApplied: (n) => `¡"${n}" aplicado!`,
      toastPresetDeleted: "Preajuste eliminado.",
      groupText:      "Texto",
      groupBg:        "Fondos",
      groupAccents:   "Acentos",
      groupStructure: "Estructura",
      groupPlayer:    "Reproductor",
      langLabel:      "Idioma",
      colorLabels: {
        csText: "Texto principal", csSubtext: "Texto secundario",
        csMain: "Fondo principal", csMainElevated: "Fondo elevado",
        csHighlight: "Hover / selección", csHighlightElevated: "Hover elevado",
        csAccent: "Acento", csPlayButton: "Botón reproducir",
        csPlayButtonHover: "Botón reproducir (hover)", csButtonDisabled: "Botón desactivado",
        csSidebar: "Barra lateral", csPlayer: "Barra del reproductor",
        csCard: "Tarjeta", csCardHover: "Hover tarjeta",
        csNotification: "Notificaciones",
        csProgressBg: "Fondo progreso", csProgressFg: "Color progreso",
        csVolumeBg: "Fondo volumen", csVolumeFg: "Color volumen",
      },
    },
    "uk": {
      subtitle:       "Налаштуйте кожен колір Spotify у реальному часі",
      tabPresets:     "Пресети",
      tabEditor:      "Редактор кольорів",
      saveBtn:        "＋ Зберегти поточний",
      presetNamePh:   "Назва пресету…",
      applyBtn:       "✓ Застосувати та зберегти",
      resetBtn:       "↺ Відновити пресет",
      defaultBtn:     "↩ Стандарт Spotify",
      toastSaved:     "Збережено та застосовано!",
      toastReset:     "Відновлено активний пресет.",
      toastDefault:   "Стандарт Spotify відновлено.",
      toastNoName:    "Введіть назву.",
      toastPresetSaved: (n) => `Пресет "${n}" збережено!`,
      toastPresetApplied: (n) => `"${n}" застосовано!`,
      toastPresetDeleted: "Пресет видалено.",
      groupText:      "Текст",
      groupBg:        "Фони",
      groupAccents:   "Акценти",
      groupStructure: "Структура",
      groupPlayer:    "Плеєр",
      langLabel:      "Мова",
      colorLabels: {
        csText: "Основний текст", csSubtext: "Другорядний текст",
        csMain: "Основний фон", csMainElevated: "Підвищений фон",
        csHighlight: "Наведення / вибір", csHighlightElevated: "Підвищене наведення",
        csAccent: "Акцент", csPlayButton: "Кнопка відтворення",
        csPlayButtonHover: "Кнопка відтворення (наведення)", csButtonDisabled: "Вимкнена кнопка",
        csSidebar: "Бічна панель", csPlayer: "Панель плеєра",
        csCard: "Картка", csCardHover: "Наведення картки",
        csNotification: "Сповіщення",
        csProgressBg: "Фон прогресу", csProgressFg: "Колір прогресу",
        csVolumeBg: "Фон гучності", csVolumeFg: "Колір гучності",
      },
    },
    "ru": {
      subtitle:       "Настройте каждый цвет Spotify в реальном времени",
      tabPresets:     "Пресеты",
      tabEditor:      "Редактор цветов",
      saveBtn:        "＋ Сохранить текущий",
      presetNamePh:   "Название пресета…",
      applyBtn:       "✓ Применить и сохранить",
      resetBtn:       "↺ Восстановить пресет",
      defaultBtn:     "↩ По умолчанию Spotify",
      toastSaved:     "Сохранено и применено!",
      toastReset:     "Активный пресет восстановлен.",
      toastDefault:   "Настройки Spotify восстановлены.",
      toastNoName:    "Введите название.",
      toastPresetSaved: (n) => `Пресет "${n}" сохранён!`,
      toastPresetApplied: (n) => `"${n}" применён!`,
      toastPresetDeleted: "Пресет удалён.",
      groupText:      "Текст",
      groupBg:        "Фоны",
      groupAccents:   "Акценты",
      groupStructure: "Структура",
      groupPlayer:    "Плеер",
      langLabel:      "Язык",
      colorLabels: {
        csText: "Основной текст", csSubtext: "Вторичный текст",
        csMain: "Основной фон", csMainElevated: "Поднятый фон",
        csHighlight: "Наведение / выбор", csHighlightElevated: "Поднятое наведение",
        csAccent: "Акцент", csPlayButton: "Кнопка воспроизведения",
        csPlayButtonHover: "Кнопка воспроизведения (наведение)", csButtonDisabled: "Отключённая кнопка",
        csSidebar: "Боковая панель", csPlayer: "Панель плеера",
        csCard: "Карточка", csCardHover: "Наведение карточки",
        csNotification: "Уведомления",
        csProgressBg: "Фон прогресса", csProgressFg: "Цвет прогресса",
        csVolumeBg: "Фон громкости", csVolumeFg: "Цвет громкости",
      },
    },
    "zh": {
      subtitle:       "实时自定义 Spotify 的每种颜色",
      tabPresets:     "预设",
      tabEditor:      "颜色编辑器",
      saveBtn:        "＋ 保存当前",
      presetNamePh:   "自定义预设名称…",
      applyBtn:       "✓ 应用并保存",
      resetBtn:       "↺ 恢复预设",
      defaultBtn:     "↩ Spotify 默认",
      toastSaved:     "已保存并应用！",
      toastReset:     "已恢复活动预设。",
      toastDefault:   "已恢复 Spotify 默认设置。",
      toastNoName:    "请输入名称。",
      toastPresetSaved: (n) => `预设"${n}"已保存！`,
      toastPresetApplied: (n) => `"${n}"已应用！`,
      toastPresetDeleted: "预设已删除。",
      groupText:      "文字",
      groupBg:        "背景",
      groupAccents:   "强调色",
      groupStructure: "结构",
      groupPlayer:    "播放器",
      langLabel:      "语言",
      colorLabels: {
        csText: "主要文字", csSubtext: "次要文字",
        csMain: "主背景", csMainElevated: "提升背景",
        csHighlight: "悬停 / 选择", csHighlightElevated: "提升悬停",
        csAccent: "强调色", csPlayButton: "播放按钮",
        csPlayButtonHover: "播放按钮（悬停）", csButtonDisabled: "禁用按钮",
        csSidebar: "侧边栏", csPlayer: "播放器栏",
        csCard: "卡片", csCardHover: "卡片悬停",
        csNotification: "通知",
        csProgressBg: "进度背景", csProgressFg: "进度颜色",
        csVolumeBg: "音量背景", csVolumeFg: "音量颜色",
      },
    },
  };

  function getLang() {
    return "en-GB";
  }

  function setLang(code) {
    Spicetify.LocalStorage.set(KEY_LANG, code);
  }

  function t() {
    return TRANSLATIONS[getLang()] || TRANSLATIONS["en-GB"];
  }

  function renderUI(container) {
    container.innerHTML = "";

    const c      = _liveColors;
    const acc    = c.csAccent            || "#1db954";
    const bg     = c.csMain              || "#121212";
    const bgEl   = c.csMainElevated      || "#1a1a1a";
    const card   = c.csCard              || "#181818";
    const hl     = c.csHighlight         || "#282828";
    const hlEl   = c.csHighlightElevated || "#3e3e3e";
    const txt    = c.csText              || "#ffffff";
    const sub    = c.csSubtext           || "#a7a7a7";
    const accTxt = contrastColor(acc);
    const accDim = adjustColor(acc, -0.1);
    const accGlo = acc + "44";

    let editColors      = { ..._liveColors };
    let activePresetKey = loadPreset();
    let activeSliderPop = null;

    // Inject adaptive UI styles
    let uiStyle = document.getElementById("cs4-ui-style");
    if (!uiStyle) { uiStyle = document.createElement("style"); uiStyle.id = "cs4-ui-style"; document.head.appendChild(uiStyle); }

    uiStyle.textContent = `
#cs4-section{border-top:1px solid ${hl};padding:40px 0 64px;font-family:'CircularSp','Circular Sp',system-ui,sans-serif}
#cs4-section *{box-sizing:border-box}
.cs4-header{display:flex;align-items:center;gap:14px;margin-bottom:6px}
.cs4-icon{width:42px;height:42px;border-radius:12px;background:${acc};display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 22px ${accGlo};flex-shrink:0}
.cs4-title{font-size:21px;font-weight:800;color:${txt};letter-spacing:-.5px;margin:0}
.cs4-subtitle{font-size:13px;color:${sub};margin:0 0 28px;padding-left:56px}
.cs4-tabs{display:flex;gap:3px;margin-bottom:24px;background:${card};border-radius:12px;padding:4px;width:fit-content}
.cs4-tab{padding:8px 22px;border-radius:9px;border:none;cursor:pointer;font-size:13px;font-weight:600;color:${sub};background:transparent;transition:all .17s;letter-spacing:.1px}
.cs4-tab:hover{color:${txt};background:${hl}}
.cs4-tab.cs4-active{color:${accTxt};background:${acc}}
.cs4-panel{display:none}
.cs4-panel.cs4-active{display:block}
/* Presets */
.cs4-presets-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:9px;margin-bottom:24px}
.cs4-preset-card{border-radius:14px;border:2px solid transparent;background:${card};padding:15px;cursor:pointer;transition:all .17s;position:relative;overflow:hidden}
.cs4-preset-card:hover{border-color:${hlEl};transform:translateY(-2px);box-shadow:0 6px 22px rgba(0,0,0,.4)}
.cs4-preset-card.cs4-active{border-color:${acc};box-shadow:0 0 0 1px ${acc},0 6px 20px ${accGlo}}
.cs4-preset-swatches{display:flex;gap:5px;margin-bottom:10px}
.cs4-swatch{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(255,255,255,.1);flex-shrink:0}
.cs4-preset-name{font-size:13px;font-weight:700;color:${txt};display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.cs4-preset-badge{font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:2px 6px;border-radius:4px;background:${accDim}33;color:${acc};margin-left:auto}
.cs4-preset-del{position:absolute;top:8px;right:8px;width:21px;height:21px;border-radius:50%;border:none;background:rgba(255,80,80,.15);color:#ff6b6b;font-size:11px;cursor:pointer;display:none;align-items:center;justify-content:center;transition:background .14s}
.cs4-preset-card:hover .cs4-preset-del{display:flex}
.cs4-preset-del:hover{background:rgba(255,80,80,.3)}
.cs4-save-row{display:flex;gap:10px;align-items:center;background:${card};border-radius:12px;padding:14px 16px}
.cs4-name-input{flex:1;background:${hl};border:1.5px solid ${hlEl};border-radius:8px;padding:8px 12px;font-size:13px;color:${txt};outline:none;transition:border-color .15s}
.cs4-name-input::placeholder{color:${sub}}
.cs4-name-input:focus{border-color:${acc}}
/* Editor */
.cs4-group-label{font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${sub};margin:22px 0 10px;padding-bottom:8px;border-bottom:1px solid ${hl}}
.cs4-group-label:first-child{margin-top:0}
.cs4-colors-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:8px}
.cs4-color-row{background:${card};border-radius:12px;padding:11px 13px;display:flex;align-items:center;gap:11px;transition:all .12s;border:1.5px solid transparent}
.cs4-color-row:hover{background:${hl};border-color:${hlEl}}
.cs4-color-row.cs4-editing{border-color:${acc};background:${hl}}
.cs4-color-circle{width:36px;height:36px;border-radius:50%;border:2.5px solid rgba(255,255,255,.15);cursor:pointer;flex-shrink:0;position:relative;transition:transform .14s,border-color .14s}
.cs4-color-circle:hover{transform:scale(1.1);border-color:rgba(255,255,255,.4)}
.cs4-color-circle input[type="color"]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border-radius:50%}
.cs4-color-lbl{flex:1;font-size:13px;font-weight:600;color:${txt};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cs4-hex{width:82px;background:${bgEl};border:1.5px solid ${hlEl};border-radius:7px;padding:5px 8px;font-family:'Courier New',monospace;font-size:12px;color:${txt};outline:none;text-align:center;transition:border-color .14s;flex-shrink:0}
.cs4-hex:focus{border-color:${acc}}
.cs4-hex.cs4-invalid{border-color:#e5534b}
.cs4-sl-btn{padding:5px 9px;border-radius:7px;border:1.5px solid ${hlEl};background:${bgEl};color:${sub};font-size:11px;cursor:pointer;transition:all .14s;flex-shrink:0}
.cs4-sl-btn:hover{background:${hl};color:${txt};border-color:${acc}}
/* Slider popup */
.cs4-sl-popup{position:fixed;z-index:99999;background:${bgEl};border:1px solid ${hlEl};border-radius:14px;padding:16px 18px;width:236px;box-shadow:0 18px 50px rgba(0,0,0,.75)}
.cs4-sl-title{font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:${sub};margin-bottom:12px}
.cs4-sl-row{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.cs4-sl-row:last-child{margin-bottom:0}
.cs4-sl-name{font-size:11px;color:${sub};width:16px;flex-shrink:0;font-weight:700}
.cs4-sl-track{flex:1;-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;outline:none;cursor:pointer}
.cs4-sl-track::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:${acc};cursor:pointer;border:2px solid ${bgEl};box-shadow:0 0 6px ${accGlo}}
.cs4-sl-val{font-size:11px;font-family:'Courier New',monospace;color:${txt};width:26px;text-align:right;flex-shrink:0}
/* Lang bar */
.cs4-lang-bar{display:none}
.cs4-lang-label{font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${sub};margin-right:4px}
.cs4-lang-btn{background:${hl};border:1.5px solid transparent;border-radius:8px;padding:5px 8px;font-size:18px;cursor:pointer;transition:all .14s;line-height:1}
.cs4-lang-btn:hover{border-color:${hlEl};transform:scale(1.12)}
.cs4-lang-btn.cs4-lang-active{border-color:${acc};box-shadow:0 0 0 1px ${acc};transform:scale(1.1)}
/* Actions */
.cs4-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:26px;padding-top:20px;border-top:1px solid ${hl}}
.cs4-btn{padding:9px 22px;border-radius:500px;font-size:13px;font-weight:700;letter-spacing:.3px;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:7px;transition:all .14s}
.cs4-btn-primary{background:${acc};color:${accTxt}}
.cs4-btn-primary:hover{filter:brightness(1.12);transform:scale(1.02);box-shadow:0 0 18px ${accGlo}}
.cs4-btn-secondary{background:${hl};color:${txt}}
.cs4-btn-secondary:hover{background:${hlEl};transform:scale(1.02)}
.cs4-btn-danger{background:rgba(255,80,80,.13);color:#ff6b6b}
.cs4-btn-danger:hover{background:rgba(255,80,80,.26)}
/* Toast */
#cs4-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(70px);background:${bgEl};color:${txt};border:1px solid ${hlEl};border-left:3px solid ${acc};padding:11px 22px;border-radius:10px;font-size:13px;font-weight:600;z-index:999999;opacity:0;pointer-events:none;white-space:nowrap;transition:opacity .22s,transform .28s cubic-bezier(.34,1.56,.64,1)}
#cs4-toast.cs4-show{opacity:1;transform:translateX(-50%) translateY(0)}
`;

    // ── Build root DOM ──
    const tr = t();
    container.innerHTML = `
<div class="cs4-header">
  <div class="cs4-icon">🎨</div>
  <h2 class="cs4-title">ChromaShift</h2>
</div>
<p class="cs4-subtitle">${tr.subtitle}</p>
<div class="cs4-lang-bar" id="cs4-lang-bar">
  <span class="cs4-lang-label">${tr.langLabel}:</span>
  ${LANGUAGES.map(l => `<button class="cs4-lang-btn${getLang()===l.code?' cs4-lang-active':''}" data-lang="${l.code}" title="${l.name}">${l.flag}</button>`).join("")}
</div>
<div class="cs4-tabs">
  <button class="cs4-tab cs4-active" data-panel="presets">${tr.tabPresets}</button>
  <button class="cs4-tab" data-panel="editor">${tr.tabEditor}</button>
</div>
<div class="cs4-panel cs4-active" id="cs4-panel-presets">
  <div class="cs4-presets-grid" id="cs4-grid"></div>
  <div class="cs4-save-row">
    <input class="cs4-name-input" id="cs4-pname" placeholder="${tr.presetNamePh}" maxlength="32">
    <button class="cs4-btn cs4-btn-primary" id="cs4-save-btn">${tr.saveBtn}</button>
  </div>
</div>
<div class="cs4-panel" id="cs4-panel-editor">
  <div id="cs4-editor"></div>
  <div class="cs4-actions">
    <button class="cs4-btn cs4-btn-primary" id="cs4-apply">${tr.applyBtn}</button>
    <button class="cs4-btn cs4-btn-secondary" id="cs4-reset">${tr.resetBtn}</button>
    <button class="cs4-btn cs4-btn-danger" id="cs4-default">${tr.defaultBtn}</button>
  </div>
</div>
`;

    // Toast
    let toastEl = document.getElementById("cs4-toast");
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.id = "cs4-toast"; document.body.appendChild(toastEl); }
    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("cs4-show");
      clearTimeout(toastEl._t);
      toastEl._t = setTimeout(() => toastEl.classList.remove("cs4-show"), 2800);
    }

    // Language buttons
    container.querySelectorAll(".cs4-lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setLang(btn.dataset.lang);
        const s = document.getElementById(SECTION_ID);
        if (s) renderUI(s);
      });
    });

    // Tabs
    container.querySelectorAll(".cs4-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        container.querySelectorAll(".cs4-tab").forEach(t => t.classList.remove("cs4-active"));
        container.querySelectorAll(".cs4-panel").forEach(p => p.classList.remove("cs4-active"));
        tab.classList.add("cs4-active");
        document.getElementById(`cs4-panel-${tab.dataset.panel}`).classList.add("cs4-active");
      });
    });

    // ── Presets ──
    function renderPresets() {
      const grid = document.getElementById("cs4-grid");
      if (!grid) return;
      grid.innerHTML = "";
      Object.entries(getAllPresets()).forEach(([key, preset]) => {
        const el = document.createElement("div");
        el.className = "cs4-preset-card" + (key === activePresetKey ? " cs4-active" : "");
        const swKeys = ["csMain","csAccent","csText","csSidebar","csPlayer"];
        el.innerHTML = `
          <div class="cs4-preset-swatches">
            ${swKeys.map(k=>`<div class="cs4-swatch" style="background:${preset.colors[k]||"#222"}"></div>`).join("")}
          </div>
          <div class="cs4-preset-name">
            <span>${preset.emoji||"🎨"}</span>
            <span>${preset.name}</span>
            ${!preset.builtin?`<span class="cs4-preset-badge">custom</span>`:""}
          </div>
          ${!preset.builtin?`<button class="cs4-preset-del" title="Elimina">✕</button>`:""}
        `;
        el.addEventListener("click", e => {
          if (e.target.closest(".cs4-preset-del")) return;
          editColors = { ...preset.colors };
          activePresetKey = key;
          applyColors(editColors);
          saveColors(editColors);
          savePreset(key);
          renderPresets();
          syncPickers();
          // Rebuild UI to adapt colors
          setTimeout(() => { const s = document.getElementById(SECTION_ID); if (s) renderUI(s); }, 80);
          toast(t().toastPresetApplied(preset.name));
        });
        const del = el.querySelector(".cs4-preset-del");
        if (del) {
          del.addEventListener("click", e => {
            e.stopPropagation();
            const customs = loadCustomPresets();
            delete customs[key];
            saveCustomPresets(customs);
            if (activePresetKey === key) { activePresetKey = "default"; savePreset("default"); }
            renderPresets();
            toast(t().toastPresetDeleted);
          });
        }
        grid.appendChild(el);
      });
    }
    renderPresets();

    document.getElementById("cs4-save-btn").addEventListener("click", () => {
      const ni = document.getElementById("cs4-pname");
      const name = ni.value.trim();
      if (!name) { toast(t().toastNoName); return; }
      const customs = loadCustomPresets();
      const key = "custom_" + Date.now();
      customs[key] = { name, emoji: "🎨", builtin: false, colors: { ...editColors } };
      saveCustomPresets(customs);
      ni.value = "";
      activePresetKey = key;
      savePreset(key);
      renderPresets();
      toast(t().toastPresetSaved(name));
    });

    // ── Color editor ──
    const editorEl = document.getElementById("cs4-editor");
    const pickerRefs = {};

    function buildEditor() {
      editorEl.innerHTML = "";
      const groups = [...new Set(COLOR_DEFS.map(d => d.group))];
      groups.forEach(group => {
        const lbl = document.createElement("div");
        lbl.className = "cs4-group-label";
        lbl.textContent = t()[group] || group;
        editorEl.appendChild(lbl);

        const grid = document.createElement("div");
        grid.className = "cs4-colors-grid";

        COLOR_DEFS.filter(d => d.group === group).forEach(def => {
          const val = editColors[def.key] || "#000000";
          const row = document.createElement("div");
          row.className = "cs4-color-row";
          row.dataset.key = def.key;
          row.innerHTML = `
            <div class="cs4-color-circle" style="background:${val}">
              <input type="color" value="${val}" data-key="${def.key}">
            </div>
            <div class="cs4-color-lbl">${t().colorLabels[def.labelKey] || def.labelKey}</div>
            <input class="cs4-hex" value="${val}" maxlength="7" spellcheck="false" data-key="${def.key}">
            <button class="cs4-sl-btn" data-slkey="${def.key}" title="Slider HSL">HSL</button>
          `;

          const picker  = row.querySelector("input[type='color']");
          const circle  = row.querySelector(".cs4-color-circle");
          const hexInp  = row.querySelector(".cs4-hex");
          const slBtn   = row.querySelector(".cs4-sl-btn");
          pickerRefs[def.key] = { picker, circle, hexInp, row };

          function setColor(v) {
            editColors[def.key] = v;
            circle.style.background = v;
            if (picker.value !== v) picker.value = v;
            if (hexInp.value !== v) hexInp.value = v;
            hexInp.classList.remove("cs4-invalid");
            applyColors(editColors);
          }

          picker.addEventListener("input", e => setColor(e.target.value));

          hexInp.addEventListener("input", e => {
            const raw = e.target.value.trim();
            if (isValidHex(raw)) { hexInp.classList.remove("cs4-invalid"); setColor(normalizeHex(raw)); }
            else hexInp.classList.add("cs4-invalid");
          });
          hexInp.addEventListener("blur", e => {
            if (!isValidHex(e.target.value)) { hexInp.value = editColors[def.key] || "#000000"; hexInp.classList.remove("cs4-invalid"); }
          });

          slBtn.addEventListener("click", e => {
            e.stopPropagation();
            openSlider(def.key, slBtn);
          });

          grid.appendChild(row);
        });
        editorEl.appendChild(grid);
      });
    }

    function syncPickers() {
      COLOR_DEFS.forEach(def => {
        const v = editColors[def.key] || "#000000";
        const r = pickerRefs[def.key];
        if (!r) return;
        r.picker.value = v;
        r.circle.style.background = v;
        r.hexInp.value = v;
        r.hexInp.classList.remove("cs4-invalid");
      });
    }

    // Slider popup
    function openSlider(key, anchor) {
      if (activeSliderPop) { activeSliderPop.remove(); activeSliderPop = null; }
      const hex = editColors[key] || "#1db954";
      const hsl = hexToHsl(hex);
      const pop = document.createElement("div");
      pop.className = "cs4-sl-popup";
      const defLabel = t().colorLabels[COLOR_DEFS.find(d => d.key === key)?.labelKey] || key;
      pop.innerHTML = `
        <div class="cs4-sl-title">${defLabel}</div>
        <div class="cs4-sl-row">
          <span class="cs4-sl-name">H</span>
          <input class="cs4-sl-track" id="cs4h" type="range" min="0" max="360" value="${hsl.h}"
            style="background:linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))">
          <span class="cs4-sl-val" id="cs4hv">${hsl.h}</span>
        </div>
        <div class="cs4-sl-row">
          <span class="cs4-sl-name">S</span>
          <input class="cs4-sl-track" id="cs4s" type="range" min="0" max="100" value="${hsl.s}"
            style="background:linear-gradient(to right,hsl(${hsl.h},0%,${hsl.l}%),hsl(${hsl.h},100%,${hsl.l}%))">
          <span class="cs4-sl-val" id="cs4sv">${hsl.s}</span>
        </div>
        <div class="cs4-sl-row">
          <span class="cs4-sl-name">L</span>
          <input class="cs4-sl-track" id="cs4l" type="range" min="0" max="100" value="${hsl.l}"
            style="background:linear-gradient(to right,#000,hsl(${hsl.h},${hsl.s}%,50%),#fff)">
          <span class="cs4-sl-val" id="cs4lv">${hsl.l}</span>
        </div>
      `;
      document.body.appendChild(pop);
      activeSliderPop = pop;

      const rect = anchor.getBoundingClientRect();
      pop.style.top  = Math.min(rect.bottom + 8, window.innerHeight - 200) + "px";
      pop.style.left = Math.min(rect.left, window.innerWidth - 252) + "px";

      const slH = pop.querySelector("#cs4h");
      const slS = pop.querySelector("#cs4s");
      const slL = pop.querySelector("#cs4l");

      function onSlide() {
        const h = +slH.value, s = +slS.value, l = +slL.value;
        pop.querySelector("#cs4hv").textContent = h;
        pop.querySelector("#cs4sv").textContent = s;
        pop.querySelector("#cs4lv").textContent = l;
        slS.style.background = `linear-gradient(to right,hsl(${h},0%,${l}%),hsl(${h},100%,${l}%))`;
        slL.style.background = `linear-gradient(to right,#000,hsl(${h},${s}%,50%),#fff)`;
        const newHex = hslToHex(h, s, l);
        const r = pickerRefs[key];
        if (!r) return;
        editColors[key] = newHex;
        r.circle.style.background = newHex;
        r.picker.value = newHex;
        r.hexInp.value = newHex;
        r.hexInp.classList.remove("cs4-invalid");
        applyColors(editColors);
      }
      [slH, slS, slL].forEach(s => s.addEventListener("input", onSlide));

      setTimeout(() => {
        function close(e) {
          if (!pop.contains(e.target) && e.target !== anchor) {
            pop.remove(); activeSliderPop = null;
            document.removeEventListener("click", close);
          }
        }
        document.addEventListener("click", close);
      }, 50);
    }

    buildEditor();

    // Action buttons
    document.getElementById("cs4-apply").addEventListener("click", () => {
      applyColors(editColors); saveColors(editColors); toast(t().toastSaved);
    });
    document.getElementById("cs4-reset").addEventListener("click", () => {
      const p = getAllPresets()[activePresetKey] || BUILTIN_PRESETS.default;
      editColors = { ...p.colors };
      syncPickers(); applyColors(editColors);
      toast(t().toastReset);
    });
    document.getElementById("cs4-default").addEventListener("click", () => {
      editColors = { ...BUILTIN_PRESETS.default.colors };
      activePresetKey = "default";
      syncPickers(); applyColors(editColors); saveColors(editColors); savePreset("default");
      setTimeout(() => { const s = document.getElementById(SECTION_ID); if (s) renderUI(s); }, 80);
      toast(t().toastDefault);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════

  function tryMount() { if (!document.getElementById(SECTION_ID)) buildUI(); }

  const navObserver = new MutationObserver(tryMount);
  navObserver.observe(document.body, { childList: true, subtree: true });

  if (Spicetify.Platform?.History) {
    Spicetify.Platform.History.listen(() => setTimeout(tryMount, 400));
  }

  // ═══════════════════════════════════════════════════════════
  // UPDATE CHECKER
  // ═══════════════════════════════════════════════════════════

  const CURRENT_VERSION  = "1.5.0";
  const REMOTE_RAW       = "https://raw.githubusercontent.com/stefaceriani/chromashift/main/chromashift.js";
  const RELEASES_URL     = "https://github.com/stefaceriani/chromashift/releases";
  const KEY_SEEN_VER     = "cs4_last_seen_version";

  function parseSemver(v) {
    return (v || "").replace(/^v/, "").split(".").map(Number);
  }

  function isNewer(remote, local) {
    const r = parseSemver(remote), l = parseSemver(local);
    for (let i = 0; i < 3; i++) {
      if ((r[i] || 0) > (l[i] || 0)) return true;
      if ((r[i] || 0) < (l[i] || 0)) return false;
    }
    return false;
  }

  function showUpdateBadge(remoteVersion) {
    if (document.getElementById("cs4-update-badge")) return;
    const acc    = _liveColors.csAccent || "#1db954";
    const accTxt = contrastColor(acc);
    const accGlo = acc + "66";

    const btn = document.createElement("a");
    btn.id   = "cs4-update-badge";
    btn.href = RELEASES_URL;
    btn.target = "_blank";
    btn.title  = `ChromaShift ${remoteVersion} disponibile — clicca per aggiornare`;
    btn.style.cssText = `
      position:fixed;bottom:88px;right:18px;z-index:9999998;
      width:44px;height:44px;border-radius:50%;
      background:${acc};
      box-shadow:0 0 0 3px ${accGlo},0 4px 18px rgba(0,0,0,.55);
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;text-decoration:none;
      transition:transform .18s,box-shadow .18s;
      animation:cs4-badge-in .3s cubic-bezier(.34,1.56,.64,1);
    `;

    btn.innerHTML = `
      <style>
        @keyframes cs4-badge-in{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
        #cs4-update-badge:hover{transform:scale(1.12)!important;box-shadow:0 0 0 4px ${accGlo},0 8px 28px rgba(0,0,0,.7)!important}
      </style>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="${accTxt}" stroke-width="2"/>
        <path d="M12 16V8M12 8L8.5 11.5M12 8L15.5 11.5" stroke="${accTxt}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    document.body.appendChild(btn);
  }

  async function checkForUpdates() {
    try {
      const res = await fetch(REMOTE_RAW + "?t=" + Date.now());
      if (!res.ok) return;
      const chunk = await res.text();
      const match = chunk.match(/\/\/\s*VERSION:\s*([\d.]+)/);
      if (!match) return;
      const remoteVersion = match[1].trim();
      if (!isNewer(remoteVersion, CURRENT_VERSION)) return;
      const seen = Spicetify.LocalStorage.get(KEY_SEEN_VER);
      if (seen === remoteVersion) return;
      showUpdateBadge("v" + remoteVersion);
    } catch (_) {}
  }

  // ═══════════════════════════════════════════════════════════
  // BOOT
  // ═══════════════════════════════════════════════════════════

  applyColors(loadColors());
  setTimeout(() => { tryMount(); runAllFixes(); }, 800);
  setTimeout(checkForUpdates, 3000);
  window.addEventListener("load", () => setTimeout(runAllFixes, 500));

})();
