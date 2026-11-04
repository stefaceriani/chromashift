(function ChromaShift() {
  "use strict";

  if (!Spicetify?.Platform) {
    setTimeout(ChromaShift, 300);
    return;
  }

  const SECTION_ID = "cs4-section";

  function isSettings() {
    return (
      window.location.pathname.startsWith("/preferences") ||
      window.location.pathname.startsWith("/settings") ||
      window.location.hash.includes("preferences") ||
      window.location.hash.includes("settings") ||
      !!document.querySelector('[data-testid="settings-page"]') ||
      !!document.querySelector('[data-testid="settings"]') ||
      !!document.querySelector(".x-settings-container") ||
      !!document.querySelector("[class*='settings-container']")
    );
  }

  function mount() {
    if (document.getElementById(SECTION_ID) || !isSettings()) return;

    const target =
      document.querySelector(".x-settings-container") ||
      document.querySelector("[class*='settings-container']") ||
      document.querySelector('[data-testid="settings-page"]') ||
      document.querySelector('[data-testid="settings"]') ||
      document.querySelector(".main-view-container__scroll-node-child") ||
      document.querySelector("[class*='scroll-node-child']");
    if (!target) return;

    const section = document.createElement("div");
    section.id = SECTION_ID;
    section.textContent = "Project under maintenance, retry later";
    section.style.cssText =
      "padding:72px 0 96px;text-align:center;font-size:clamp(44px,8vw,110px);" +
      "font-weight:900;line-height:1.05;letter-spacing:-0.03em;color:#ffffff;";
    target.appendChild(section);
  }

  let timer;
  new MutationObserver(() => {
    if (document.getElementById(SECTION_ID)) return;
    clearTimeout(timer);
    timer = setTimeout(mount, 300);
  }).observe(document.body, { childList: true, subtree: true });

  if (Spicetify.Platform.History) {
    Spicetify.Platform.History.listen(() => setTimeout(mount, 400));
  }

  setTimeout(mount, 800);
})();
