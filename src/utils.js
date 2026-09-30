  // ===========================================================
  // UTILITIES
  // ===========================================================

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


