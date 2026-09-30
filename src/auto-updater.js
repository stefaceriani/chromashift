  // ===========================================================
  // AUTO-UPDATER
  // ===========================================================

  const CURRENT_VERSION  = "3.3.4";
  const RELEASES_API     = "https://api.github.com/repos/stefaceriani/chromashift/releases/latest";
  const RELEASES_PAGE    = "https://github.com/stefaceriani/chromashift/releases";
  const UPDATE_INTERVAL  = 60 * 60 * 1000;

  function parseSemver(v) {
    return (v || "").replace(/^v/, "").split(".").map(Number);
  }

  function isNewer(remote, local) {
    const r = parseSemver(remote), l = parseSemver(local);
    for (let i = 0; i < 3; i++) {
      if ((r[i] || 0) > (l[i] || 0)) return true;
      if ((r[i] || 0) < (l[i] || 0)) return false;
    }
    return false;
  }

  function showUpdateBadge(remoteVersion) {
    if (document.getElementById("cs4-update-badge")) return;

    const acc    = _liveColors.csAccent || "#1db954";
    const accTxt = contrastColor(acc);
    const accGlo = acc + "66";

    const badge = document.createElement("div");
    badge.id = "cs4-update-badge";
    badge.style.cssText = `
      position:fixed;bottom:88px;right:18px;z-index:9999998;
      background:${acc};color:${accTxt};
      border-radius:14px;padding:10px 16px;
      box-shadow:0 0 0 3px ${accGlo},0 4px 18px rgba(0,0,0,.55);
      font-size:12px;font-weight:700;font-family:inherit;
      display:flex;align-items:center;gap:8px;
      cursor:pointer;
      animation:cs4-badge-in .35s cubic-bezier(.34,1.56,.64,1);
      max-width:300px;user-select:none;
    `;

    badge.innerHTML = `
      <style>
        @keyframes cs4-badge-in{from{opacity:0;transform:translateY(12px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}
        #cs4-update-badge:hover{filter:brightness(1.1)}
      </style>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 16V8M12 8L8.5 11.5M12 8L15.5 11.5" stroke="${accTxt}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="10" stroke="${accTxt}" stroke-width="2"/>
      </svg>
      <span>ChromaShift v${remoteVersion} available — click to restart</span>
      <span id="cs4-badge-close" style="margin-left:4px;opacity:.65;cursor:pointer;font-size:15px;line-height:1">✕</span>
    `;

    document.body.appendChild(badge);
    badge.addEventListener("click", async (e) => {
      if (e.target.id === "cs4-badge-close") { badge.remove(); return; }
      const msgEl = badge.querySelector("span:not(#cs4-badge-close)");
      msgEl.textContent = "Clearing cache…";
      try {
        await fetch("https://purge.jsdelivr.net/gh/stefaceriani/chromashift@main/chromashift.js");
      } catch (_) {}

      msgEl.textContent = "Restarting…";
      await new Promise(r => setTimeout(r, 800));
      try { Spicetify.Platform.reload(); return; } catch (_) {}
      try { window.location.reload(); return; } catch (_) {}
      window.open(RELEASES_PAGE, "_blank");
    });

    document.getElementById("cs4-badge-close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      badge.remove();
    });
    setTimeout(() => badge?.remove(), 15000);
  }

  async function checkForUpdates() {
    try {
      const res = await fetch(RELEASES_API + "?t=" + Date.now(), {
        headers: { "Accept": "application/vnd.github.v3+json" }
      });
      if (!res.ok) return;
      const data = await res.json();
      const remoteVersion = (data.tag_name || "").replace(/^v/, "");
      if (!remoteVersion) return;
      if (!isNewer(remoteVersion, CURRENT_VERSION)) return;
      showUpdateBadge(remoteVersion);
    } catch (_) {}
  }


