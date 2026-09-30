  // ===========================================================
  // CSS INJECTION
  // ===========================================================

  let styleEl = document.getElementById("cs4-style");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "cs4-style";
    document.head.appendChild(styleEl);
  }

