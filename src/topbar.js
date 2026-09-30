  let _liveColors = loadColors();

  function isHomePage() {
    return !!(
      document.querySelector("[data-testid='home-page']") ||
      window.location.pathname === "/" ||
      window.location.pathname === "/home"
    );
  }
  const TOPBAR_SELS = [
    ".Root__top-bar",
    ".main-topBar-container",
    ".main-topBar-background",
    "[data-testid='topbar-background']",
  ];

  let _topBarScrollEl = null;
  let _topBarWriting = false;

  function applyTopBarColor(color) {
    if (_topBarWriting) return;
    _topBarWriting = true;
    TOPBAR_SELS.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (el.dataset.cs4Tbg === color) return;
        el.dataset.cs4Tbg = color;
        el.style.setProperty("background-color", color, "important");
        el.style.setProperty("background",       color, "important");
        el.style.setProperty("background-image", "none", "important");
        el.style.setProperty("box-shadow",       "none", "important");
        el.style.setProperty("backdrop-filter",  "none", "important");
        el.style.setProperty("-webkit-backdrop-filter", "none", "important");
      });
    });
    _topBarWriting = false;
  }

  function fixTopBar() {
    const bg = _liveColors.csMain || "#121212";

    const scrollEl =
      document.querySelector(".main-view-container__scroll-node") ||
      document.querySelector("[class*='scrollNode']") ||
      document.querySelector("[class*='scroll-node']") ||
      document.querySelector("[data-overlayscrollbars-viewport]") ||
      document.querySelector(".os-viewport");

    if (scrollEl && _topBarScrollEl !== scrollEl) {
      _topBarScrollEl = scrollEl;
      scrollEl.addEventListener("scroll", () => {
        const color = (isHomePage() || _topBarScrollEl.scrollTop <= 10) ? "transparent" : bg;
        applyTopBarColor(color);
      }, { passive: true });
    }

    const scrolled = _topBarScrollEl ? _topBarScrollEl.scrollTop > 10 : false;
    const color = (isHomePage() || !scrolled) ? "transparent" : bg;
    applyTopBarColor(color);
  }

  function fixTopBarContent() {
    document.querySelectorAll(".main-topBar-topbarContentContainer").forEach(el => {
      const color = isHomePage() ? "" : "transparent";
      if (color) {
        el.style.setProperty("background-color", color, "important");
      } else {
        el.style.removeProperty("background-color");
      }
    });
  }


