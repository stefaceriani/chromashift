  const SBL_BODY_CLASS = "cs4-sbl-active";

  // ===========================================================
  // SIMPLE BEAUTIFUL LYRICS COMPATIBILITY
  // ===========================================================

  function sblCheck() {
    if (document.querySelector(".lyrics-lyrics-container")) {
      document.body.classList.add(SBL_BODY_CLASS);
    } else {
      document.body.classList.remove(SBL_BODY_CLASS);
    }
  }

  sblCheck();
  new MutationObserver(sblCheck).observe(document.body, { childList: true, subtree: true });

