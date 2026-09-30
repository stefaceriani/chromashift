  // ===========================================================
  // NAVIGATION
  // ===========================================================

  function tryMount() { if (!document.getElementById(SECTION_ID)) buildUI(); }

  const navObserver = new MutationObserver(tryMount);
  navObserver.observe(document.body, { childList: true, subtree: true });

  if (Spicetify.Platform?.History) {
    Spicetify.Platform.History.listen(() => setTimeout(tryMount, 400));
  }


