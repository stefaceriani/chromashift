  function runAllFixes() { fixTopBar(); fixTopBarContent(); fixPlayButtons(); fixFilterBar(); sblCheck(); }

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


