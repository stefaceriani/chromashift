// CHR MODULE: font
// Applies a Google Fonts font to every text in Spotify.
// Config (set with `chr font <name>` or `chr set font name <name>`):
//   CHR_CONFIG.name  ->  Google Fonts family name, e.g. "Space Grotesk"
//
// The CLI wraps this file in (function (CHR_CONFIG) { ... })({...}) when it installs it,
// so CHR_CONFIG is always defined here.

const name = ((CHR_CONFIG && CHR_CONFIG.name) || "").replace(/["<>]/g, "").trim();
const LINK_ID = "chr-font-link";
const STYLE_ID = "chr-font-style";

function clear() {
  document.getElementById(LINK_ID)?.remove();
  document.getElementById(STYLE_ID)?.remove();
}

function apply() {
  const stack = `"${name}",sans-serif`;
  let st = document.getElementById(STYLE_ID);
  if (!st) {
    st = document.createElement("style");
    st.id = STYLE_ID;
    document.head.appendChild(st);
  }
  st.textContent = `
:root,[class*="encore-"],[class*="Root__"]{
  --encore-title-font-stack:${stack}!important;--encore-body-font-stack:${stack}!important;
  --encore-font-stack:${stack}!important;--font-family:${stack}!important;
}
html,body,body *:not(svg):not(svg *){font-family:${stack}!important}
`;
}

function load() {
  const fam = encodeURIComponent(name).replace(/%20/g, "+");
  const urls = [
    `https://fonts.googleapis.com/css2?family=${fam}:wght@300;400;500;600;700;800&display=swap`,
    `https://fonts.googleapis.com/css2?family=${fam}&display=swap`,
  ];
  let i = 0;
  const next = () => {
    if (i >= urls.length) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = urls[i++];
    link.onerror = () => { link.remove(); next(); };
    link.onload = () => {
      document.getElementById(LINK_ID)?.remove();
      link.id = LINK_ID;
      apply();
    };
    document.head.appendChild(link);
  };
  next();
}

(function main() {
  if (!document.head) return setTimeout(main, 100);
  clear();
  if (name) load();
})();
