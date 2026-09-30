  // ===========================================================
  // BOOT
  // ===========================================================

  applyColors(loadColors());
  setTimeout(() => { tryMount(); runAllFixes(); }, 800);
  setTimeout(checkForUpdates, 5000);
  setInterval(checkForUpdates, UPDATE_INTERVAL);
  window.addEventListener("load", () => setTimeout(runAllFixes, 500));

