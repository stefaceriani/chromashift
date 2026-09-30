  function fixPlayButtons() {
    const pbtn      = _liveColors.csPlayButton     || _liveColors.csButton || "#1db954";
    const pbtnHov   = _liveColors.csPlayButtonHover || adjustColor(pbtn, 0.1);
    const pbtnText  = contrastColor(pbtn);
    document.querySelectorAll("[data-testid='control-button-playpause']").forEach(btn => {
      btn.style.setProperty("background-color", pbtn, "important");
      btn.style.setProperty("color", pbtnText, "important");
      btn.style.setProperty("border-radius", "50%", "important");
      btn.querySelectorAll("svg,path,polygon").forEach(el => {
        el.style.setProperty("fill", pbtnText, "important");
        el.style.setProperty("color", pbtnText, "important");
      });
      if (!btn.dataset.cs4Hooked) {
        btn.dataset.cs4Hooked = "1";
        btn.addEventListener("mouseenter", () => btn.style.setProperty("background-color", pbtnHov, "important"));
        btn.addEventListener("mouseleave", () => btn.style.setProperty("background-color", pbtn, "important"));
      }
    });

    document.querySelectorAll(".main-playButton-PlayButton,[data-testid='play-button']").forEach(btn => {
      if (
        btn.closest("[class*='TrackListRow']") || btn.closest("[class*='tracklist-row']") ||
        btn.closest(".main-trackList-trackListRow") || btn.closest("[data-testid='tracklist-row']") ||
        btn.closest("[data-testid='queue-row']") || btn.closest("[class*='QueueRow']") ||
        btn.dataset.testid === "control-button-playpause"
      ) return;
      btn.style.setProperty("color", pbtnText, "important");
      btn.querySelectorAll("svg,path,polygon").forEach(el => {
        el.style.setProperty("fill", pbtnText, "important");
        el.style.setProperty("color", pbtnText, "important");
      });
      if (
        btn.closest("[class*='actionBar']") || btn.closest("[class*='ActionBar']") ||
        btn.closest("[class*='entityHeader']") || btn.closest("[class*='EntityHeader']")
      ) {
        btn.style.setProperty("background-color", pbtn, "important");
        btn.style.setProperty("border-radius", "50%", "important");
        if (!btn.dataset.cs4Hooked) {
          btn.dataset.cs4Hooked = "1";
          btn.addEventListener("mouseenter", () => btn.style.setProperty("background-color", pbtnHov, "important"));
          btn.addEventListener("mouseleave", () => btn.style.setProperty("background-color", pbtn, "important"));
        }
        return;
      }
      btn.style.removeProperty("background-color");
      btn.style.setProperty("border-radius", "50%", "important");

      if (!btn.dataset.cs4Hooked) {
        btn.dataset.cs4Hooked = "1";
        let cardAnchor =
          btn.closest(".main-card-card") ||
          btn.closest("[class*='CardComponent']") ||
          btn.closest("[data-testid='card-container']") ||
          btn.closest("[data-testid='shortcut']") ||
          btn.closest("[class*='shortcut']") ||
          btn.closest("[class*='Shortcut']") ||
          btn.closest("[class*='recentlyPlayed']") ||
          btn.closest("[class*='RecentlyPlayed']") ||
          btn.closest("[class*='gridItem']");
        if (!cardAnchor) {
          let el = btn.parentElement;
          for (let i = 0; i < 6 && el; i++) {
            if (getComputedStyle(el).pointerEvents !== "none") { cardAnchor = el; break; }
            el = el.parentElement;
          }
        }
        if (!cardAnchor) cardAnchor = btn.parentElement;
        if (cardAnchor) {
          const isShortcutCard = !!btn.closest(".kyJXPKlxWxJleoZlsuUa");
          if (isShortcutCard) {
            btn.style.setProperty("opacity", "0", "important");
            cardAnchor.addEventListener("mouseenter", () => btn.style.setProperty("opacity", "1", "important"));
            cardAnchor.addEventListener("mouseleave", () => btn.style.setProperty("opacity", "0", "important"));
          }
          cardAnchor.addEventListener("mouseenter", () => {
            btn.style.setProperty("background-color", pbtn, "important");
          });
          cardAnchor.addEventListener("mouseleave", () => {
            btn.style.removeProperty("background-color");
          });
          btn.addEventListener("mouseenter", () => btn.style.setProperty("background-color", pbtnHov, "important"));
          btn.addEventListener("mouseleave", () => btn.style.setProperty("background-color", pbtn, "important"));
        }
      }
    });
  }


