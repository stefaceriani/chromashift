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

  function isCommunityEnabled() {
    return Spicetify.LocalStorage.get(KEY_COMMUNITY_ENABLED) === "1";
  }

  function setCommunityEnabled(val) {
    Spicetify.LocalStorage.set(KEY_COMMUNITY_ENABLED, val ? "1" : "0");
  }

  function loadCommunityPresets() {
    try {
      const s = Spicetify.LocalStorage.get(KEY_COMMUNITY_PRESETS);
      if (s) return JSON.parse(s);
    } catch (_) {}
    return {};
  }

  function saveCommunityPresets(obj) {
    Spicetify.LocalStorage.set(KEY_COMMUNITY_PRESETS, JSON.stringify(obj));
  }

  async function fetchCommunityPresets() {
    const URLS = [
      "https://cdn.jsdelivr.net/gh/stefaceriani/chromashift@main/custom_preset",
      "https://raw.githubusercontent.com/stefaceriani/chromashift/main/custom_preset",
    ];

    let index = null;
    let baseUrl = null;

    for (const base of URLS) {
      try {
        const res = await fetch(base + "/index.json?t=" + Date.now());
        if (res.ok) { index = await res.json(); baseUrl = base; break; }
      } catch (_) {}
    }

    if (!Array.isArray(index) || index.length === 0) return null;

    const presets = {};
    await Promise.all(index.map(async (filename) => {
      try {
        const res = await fetch(baseUrl + "/" + filename + "?t=" + Date.now());
        if (!res.ok) return;
        const code = await res.text();

        const nameMatch = code.match(/\/\/\s*PRESET NAME:\s*(.+)/);
        if (!nameMatch) return;
        const nameFull = nameMatch[1].trim();
        const emojiMatch = nameFull.match(/^\p{Emoji}+\s*/u);
        const emoji = emojiMatch ? emojiMatch[0].trim() : "🎨";
        const name = nameFull.replace(/^\p{Emoji}+\s*/u, "").trim() || nameFull;

        const colorsMatch = code.match(/colors:\s*\{([\s\S]*?)\}/);
        if (!colorsMatch) return;
        const colors = Function('"use strict"; return {' + colorsMatch[1] + '}')();
        if (!colors || typeof colors !== "object") return;

        const key = "community_" + filename.replace(".js", "").replace(/[^a-z0-9]/gi, "_").toLowerCase();
        presets[key] = { name, emoji, builtin: false, community: true, colors };
      } catch (_) {}
    }));

    return Object.keys(presets).length > 0 ? presets : null;
  }

  function getAllPresets() {
    const community = isCommunityEnabled() ? loadCommunityPresets() : {};
    return { ...BUILTIN_PRESETS, ...community, ...loadCustomPresets() };
  }


