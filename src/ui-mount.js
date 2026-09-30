  const SECTION_ID = "cs4-section";

  // ===========================================================
  // UI
  // ===========================================================

  function buildUI() {
    if (document.getElementById(SECTION_ID)) return;

    const isSettings =
      window.location.pathname.startsWith("/preferences") ||
      window.location.pathname.startsWith("/settings") ||
      window.location.hash.includes("preferences") ||
      window.location.hash.includes("settings") ||
      !!document.querySelector('[data-testid="settings-page"]') ||
      !!document.querySelector('[data-testid="settings"]') ||
      !!document.querySelector(".x-settings-container") ||
      !!document.querySelector("[class*='settings-container']");
    if (!isSettings) return;

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
    target.appendChild(section);
    renderUI(section);
  }


