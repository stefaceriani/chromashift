  // ===========================================================
  // FILTER BAR (Home): transparent at rest, solid on scroll
  // ===========================================================

  const FILTER_SELS = [
    ".search-searchCategory-contentArea",
    "[class*='search-searchCategory-contentArea']",
  ];

  let _filterScrollListener = null;
  let _filterScrollEl       = null;

  function applyFilterBarStyle(scrolled) {
    const bgEl = _liveColors.csMainElevated || "#1a1a1a";
    FILTER_SELS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!scrolled) {
          el.style.setProperty("background-color", "transparent", "important");
          el.style.setProperty("background", "transparent", "important");
          el.style.setProperty("box-shadow", "none", "important");
        } else {
          el.style.setProperty("background-color", bgEl, "important");
          el.style.setProperty("background", bgEl, "important");
          el.style.setProperty("box-shadow", "0 2px 8px rgba(0,0,0,.45)", "important");
        }
      });
    });
  }

  function attachFilterScrollObserver() {
    if (!isHomePage()) return;
    const scrollEl =
      document.querySelector(".main-view-container__scroll-node") ||
      document.querySelector("[class*='scrollNode']") ||
      document.querySelector("[class*='scroll-node']") ||
      document.querySelector("[data-overlayscrollbars-viewport]") ||
      document.querySelector(".os-viewport");
    if (!scrollEl || _filterScrollEl === scrollEl) return;
    if (_filterScrollEl && _filterScrollListener) {
      _filterScrollEl.removeEventListener("scroll", _filterScrollListener);
    }
    _filterScrollEl = scrollEl;
    applyFilterBarStyle(false);
    _filterScrollListener = () => applyFilterBarStyle(scrollEl.scrollTop > 10);
    scrollEl.addEventListener("scroll", _filterScrollListener, { passive: true });
  }

  function fixFilterBar() {
    if (!isHomePage()) return;
    applyFilterBarStyle(_filterScrollEl ? _filterScrollEl.scrollTop > 10 : false);
    attachFilterScrollObserver();
  }

