  function renderUI(container) {
    container.innerHTML = "";

    const c      = _liveColors;
    const acc    = c.csAccent            || "#1db954";
    const bg     = c.csMain              || "#121212";
    const bgEl   = c.csMainElevated      || "#1a1a1a";
    const card   = c.csCard              || "#181818";
    const hl     = c.csHighlight         || "#282828";
    const hlEl   = c.csHighlightElevated || "#3e3e3e";
    const txt    = c.csText              || "#ffffff";
    const sub    = c.csSubtext           || "#a7a7a7";
    const accTxt = contrastColor(acc);
    const accDim = adjustColor(acc, -0.1);
    const accGlo = acc + "44";

    let editColors      = { ..._liveColors };
    let activePresetKey = loadPreset();
    let activeSliderPop = null;

    let historyStack = [{ ...editColors }];
    let historyIndex = 0;

    function pushHistory() {
      historyStack = historyStack.slice(0, historyIndex + 1);
      historyStack.push({ ...editColors });
      if (historyStack.length > 50) historyStack.shift();
      historyIndex = historyStack.length - 1;
      updateUndoRedoBtns();
    }
    function undo() {
      if (historyIndex <= 0) return;
      historyIndex--;
      editColors = { ...historyStack[historyIndex] };
      syncPickers();
      applyColors(editColors);
      updateUndoRedoBtns();
    }
    function redo() {
      if (historyIndex >= historyStack.length - 1) return;
      historyIndex++;
      editColors = { ...historyStack[historyIndex] };
      syncPickers();
      applyColors(editColors);
      updateUndoRedoBtns();
    }
    function updateUndoRedoBtns() {
      const u = document.getElementById("cs4-undo");
      const r = document.getElementById("cs4-redo");
      if (u) u.disabled = historyIndex <= 0;
      if (r) r.disabled = historyIndex >= historyStack.length - 1;
    }

    let uiStyle = document.getElementById("cs4-ui-style");
    if (!uiStyle) { uiStyle = document.createElement("style"); uiStyle.id = "cs4-ui-style"; document.head.appendChild(uiStyle); }

    uiStyle.textContent = `
#cs4-section{border-top:1px solid ${hl};padding:40px 0 64px;font-family:'CircularSp','Circular Sp',system-ui,sans-serif}
#cs4-section *{box-sizing:border-box}
.cs4-header{display:flex;align-items:center;gap:14px;margin-bottom:6px}
.cs4-icon{width:42px;height:42px;border-radius:12px;background:${acc};display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 0 22px ${accGlo};flex-shrink:0}
.cs4-title{font-size:21px;font-weight:800;color:${txt};letter-spacing:-.5px;margin:0}
.cs4-subtitle{font-size:13px;color:${sub};margin:0 0 28px;padding-left:56px}
.cs4-tabs{display:flex;gap:3px;margin-bottom:24px;background:${card};border-radius:12px;padding:4px;width:fit-content}
.cs4-tab{padding:8px 22px;border-radius:9px;border:none;cursor:pointer;font-size:13px;font-weight:600;color:${sub};background:transparent;transition:all .17s;letter-spacing:.1px}
.cs4-tab:hover{color:${txt};background:${hl}}
.cs4-tab.cs4-active{color:${accTxt};background:${acc}}
.cs4-panel{display:none}
.cs4-panel.cs4-active{display:block}
.cs4-presets-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:9px;margin-bottom:24px}
.cs4-preset-card{border-radius:14px;border:2px solid transparent;background:${card};padding:15px;cursor:pointer;transition:all .17s;position:relative;overflow:hidden}
.cs4-preset-card:hover{border-color:${hlEl};transform:translateY(-2px);box-shadow:0 6px 22px rgba(0,0,0,.4)}
.cs4-preset-card.cs4-active{border-color:${acc};box-shadow:0 0 0 1px ${acc},0 6px 20px ${accGlo}}
.cs4-preset-swatches{display:flex;gap:5px;margin-bottom:10px}
.cs4-swatch{width:18px;height:18px;border-radius:50%;border:1.5px solid rgba(255,255,255,.1);flex-shrink:0}
.cs4-preset-name{font-size:13px;font-weight:700;color:${txt};display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.cs4-preset-badge{font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:2px 6px;border-radius:4px;background:${accDim}33;color:${acc};margin-left:auto}
.cs4-preset-badge-community{font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;padding:2px 6px;border-radius:4px;background:#5865F233;color:#5865F2;margin-left:auto}
.cs4-community-row{display:flex;align-items:center;justify-content:space-between;background:${card};border-radius:12px;padding:12px 16px;margin-bottom:14px;gap:12px}
.cs4-community-label{font-size:12px;font-weight:600;color:${sub};display:flex;align-items:center;gap:6px}
.cs4-community-toggle{position:relative;width:40px;height:22px;flex-shrink:0}
.cs4-community-toggle input{opacity:0;width:0;height:0;position:absolute}
.cs4-community-slider{position:absolute;inset:0;background:${hlEl};border-radius:11px;cursor:pointer;transition:background .2s}
.cs4-community-toggle input:checked + .cs4-community-slider{background:${acc}}
.cs4-community-slider:before{content:"";position:absolute;width:16px;height:16px;left:3px;top:3px;background:#fff;border-radius:50%;transition:transform .2s}
.cs4-community-toggle input:checked + .cs4-community-slider:before{transform:translateX(18px)}
.cs4-preset-del{position:absolute;top:8px;right:8px;width:21px;height:21px;border-radius:50%;border:none;background:rgba(255,80,80,.15);color:#ff6b6b;font-size:11px;cursor:pointer;display:none;align-items:center;justify-content:center;transition:background .14s}
.cs4-preset-card:hover .cs4-preset-del{display:flex}
.cs4-preset-del:hover{background:rgba(255,80,80,.3)}
.cs4-save-row{display:flex;gap:10px;align-items:center;background:${card};border-radius:12px;padding:14px 16px}
.cs4-name-input{flex:1;background:${hl};border:1.5px solid ${hlEl};border-radius:8px;padding:8px 12px;font-size:13px;color:${txt};outline:none;transition:border-color .15s}
.cs4-name-input::placeholder{color:${sub}}
.cs4-name-input:focus{border-color:${acc}}
.cs4-group-label{font-size:10px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:${sub};margin:22px 0 10px;padding-bottom:8px;border-bottom:1px solid ${hl}}
.cs4-group-label:first-child{margin-top:0}
.cs4-colors-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:8px}
.cs4-color-row{background:${card};border-radius:12px;padding:11px 13px;display:flex;align-items:center;gap:11px;transition:all .12s;border:1.5px solid transparent}
.cs4-color-row:hover{background:${hl};border-color:${hlEl}}
.cs4-color-row.cs4-editing{border-color:${acc};background:${hl}}
.cs4-color-circle{width:36px;height:36px;border-radius:50%;border:2.5px solid rgba(255,255,255,.15);cursor:pointer;flex-shrink:0;position:relative;transition:transform .14s,border-color .14s}
.cs4-color-circle:hover{transform:scale(1.1);border-color:rgba(255,255,255,.4)}
.cs4-color-circle input[type="color"]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border-radius:50%}
.cs4-color-lbl{flex:1;font-size:13px;font-weight:600;color:${txt};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cs4-hex{width:82px;background:${bgEl};border:1.5px solid ${hlEl};border-radius:7px;padding:5px 8px;font-family:'Courier New',monospace;font-size:12px;color:${txt};outline:none;text-align:center;transition:border-color .14s;flex-shrink:0}
.cs4-hex:focus{border-color:${acc}}
.cs4-hex.cs4-invalid{border-color:#e5534b}
.cs4-sl-btn{padding:5px 9px;border-radius:7px;border:1.5px solid ${hlEl};background:${bgEl};color:${sub};font-size:11px;cursor:pointer;transition:all .14s;flex-shrink:0}
.cs4-sl-btn:hover{background:${hl};color:${txt};border-color:${acc}}
.cs4-sl-popup{position:fixed;z-index:99999;background:${bgEl};border:1px solid ${hlEl};border-radius:14px;padding:16px 18px;width:236px;box-shadow:0 18px 50px rgba(0,0,0,.75)}
.cs4-sl-title{font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:${sub};margin-bottom:12px}
.cs4-sl-row{display:flex;align-items:center;gap:9px;margin-bottom:8px}
.cs4-sl-row:last-child{margin-bottom:0}
.cs4-sl-name{font-size:11px;color:${sub};width:16px;flex-shrink:0;font-weight:700}
.cs4-sl-track{flex:1;-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;outline:none;cursor:pointer}
.cs4-sl-track::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:${acc};cursor:pointer;border:2px solid ${bgEl};box-shadow:0 0 6px ${accGlo}}
.cs4-sl-val{font-size:11px;font-family:'Courier New',monospace;color:${txt};width:26px;text-align:right;flex-shrink:0}
.cs4-lang-bar{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:18px}
.cs4-lang-label{font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${sub};margin-right:4px}
.cs4-lang-btn{background:${hl};border:1.5px solid transparent;border-radius:8px;padding:5px 8px;font-size:18px;cursor:pointer;transition:all .14s;line-height:1}
.cs4-lang-btn:hover{border-color:${hlEl};transform:scale(1.12)}
.cs4-lang-btn.cs4-lang-active{border-color:${acc};box-shadow:0 0 0 1px ${acc};transform:scale(1.1)}
.cs4-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:26px;padding-top:20px;border-top:1px solid ${hl}}
.cs4-icon-btn{width:42px;height:42px;border-radius:50%;border:1.5px solid ${hlEl};background:${card};color:${txt};cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .14s;margin-left:auto}
.cs4-icon-btn + .cs4-icon-btn{margin-left:0}
.cs4-icon-btn:hover:not(:disabled){background:${hl};border-color:${acc};color:${acc}}
.cs4-icon-btn:disabled{opacity:.3;cursor:default}
.cs4-footer{margin-top:24px;text-align:center}
.cs4-footer-link{font-size:12px;color:${sub};text-decoration:none;font-weight:700;transition:color .15s}
.cs4-footer-link:hover{color:${acc};text-decoration:underline}
.cs4-btn{padding:9px 22px;border-radius:500px;font-size:13px;font-weight:700;letter-spacing:.3px;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:7px;transition:all .14s}
.cs4-btn-primary{background:${acc};color:${accTxt}}
.cs4-btn-primary:hover{filter:brightness(1.12);transform:scale(1.02);box-shadow:0 0 18px ${accGlo}}
.cs4-btn-secondary{background:${hl};color:${txt}}
.cs4-btn-secondary:hover{background:${hlEl};transform:scale(1.02)}
.cs4-btn-danger{background:rgba(255,80,80,.13);color:#ff6b6b}
.cs4-btn-danger:hover{background:rgba(255,80,80,.26)}
#cs4-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(70px);background:${bgEl};color:${txt};border:1px solid ${hlEl};border-left:3px solid ${acc};padding:11px 22px;border-radius:10px;font-size:13px;font-weight:600;z-index:999999;opacity:0;pointer-events:none;white-space:nowrap;transition:opacity .22s,transform .28s cubic-bezier(.34,1.56,.64,1)}
#cs4-toast.cs4-show{opacity:1;transform:translateX(-50%) translateY(0)}
`;
    const tr = t();
    container.innerHTML = `
<div class="cs4-header">
  <div class="cs4-icon">🎨</div>
  <h2 class="cs4-title">ChromaShift</h2>
</div>
<p class="cs4-subtitle">${tr.subtitle}</p>
<div class="cs4-lang-bar" id="cs4-lang-bar">
  <span class="cs4-lang-label">${tr.langLabel}:</span>
  ${LANGUAGES.map(l => `<button class="cs4-lang-btn${getLang()===l.code?' cs4-lang-active':''}" data-lang="${l.code}" title="${l.name}">${l.flag}</button>`).join("")}
</div>
<div class="cs4-tabs">
  <button class="cs4-tab cs4-active" data-panel="presets">${tr.tabPresets}</button>
  <button class="cs4-tab" data-panel="editor">${tr.tabEditor}</button>
  <button class="cs4-tab" data-panel="cloud">${tr.tabCloud}</button>
  <button class="cs4-tab" data-panel="settings">${tr.tabSettings}</button>
</div>
<div class="cs4-panel cs4-active" id="cs4-panel-presets">
  <div class="cs4-presets-grid" id="cs4-grid"></div>
  <div class="cs4-save-row">
    <input class="cs4-name-input" id="cs4-pname" placeholder="${tr.presetNamePh}" maxlength="32">
    <button class="cs4-btn cs4-btn-primary" id="cs4-save-btn">${tr.saveBtn}</button>
  </div>
</div>
<div class="cs4-panel" id="cs4-panel-editor">
  <div id="cs4-editor"></div>
  <div class="cs4-actions">
    <button class="cs4-btn cs4-btn-primary" id="cs4-apply">${tr.applyBtn}</button>
    <button class="cs4-btn cs4-btn-secondary" id="cs4-reset">${tr.resetBtn}</button>
    <button class="cs4-btn cs4-btn-danger" id="cs4-default">${tr.defaultBtn}</button>
    <button class="cs4-icon-btn" id="cs4-undo" title="${tr.undoTitle}" disabled>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
    </button>
    <button class="cs4-icon-btn" id="cs4-redo" title="${tr.redoTitle}" disabled>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>
    </button>
  </div>
</div>
<div class="cs4-panel" id="cs4-panel-cloud">
  <div id="cs4-cloud-container"></div>
</div>
<div class="cs4-panel" id="cs4-panel-settings">
  <div class="cs4-community-row">
    <span class="cs4-community-label">${tr.communityLabel}</span>
    <label class="cs4-community-toggle">
      <input type="checkbox" id="cs4-community-chk" ${isCommunityEnabled() ? "checked" : ""}>
      <span class="cs4-community-slider"></span>
    </label>
  </div>
  <div class="cs4-community-row" style="margin-top:12px;">
    <span class="cs4-community-label" id="cs4-versions-label">${tr.versionsLabel}</span>
    <button class="cs4-btn" id="cs4-versions-copy-btn" title="${tr.versionsCopyTitle}">${tr.versionsCopyBtn}</button>
  </div>
</div>
<div class="cs4-footer">
  <a class="cs4-footer-link" href="https://chromashift.qzz.io/" target="_blank">${tr.footerLink}</a>
</div>
`;
    let toastEl = document.getElementById("cs4-toast");
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.id = "cs4-toast"; document.body.appendChild(toastEl); }
    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add("cs4-show");
      clearTimeout(toastEl._t);
      toastEl._t = setTimeout(() => toastEl.classList.remove("cs4-show"), 2800);
    }
    container.querySelectorAll(".cs4-lang-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        setLang(btn.dataset.lang);
        const s = document.getElementById(SECTION_ID);
        if (s) renderUI(s);
      });
    });
    container.querySelectorAll(".cs4-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        container.querySelectorAll(".cs4-tab").forEach(t => t.classList.remove("cs4-active"));
        container.querySelectorAll(".cs4-panel").forEach(p => p.classList.remove("cs4-active"));
        tab.classList.add("cs4-active");
        document.getElementById(`cs4-panel-${tab.dataset.panel}`).classList.add("cs4-active");
      });
    });
    function renderPresets() {
      const grid = document.getElementById("cs4-grid");
      if (!grid) return;
      grid.innerHTML = "";
      Object.entries(getAllPresets()).forEach(([key, preset]) => {
        const el = document.createElement("div");
        el.className = "cs4-preset-card" + (key === activePresetKey ? " cs4-active" : "");
        const swKeys = ["csMain","csAccent","csText","csSidebar","csPlayer"];
        el.innerHTML = `
          <div class="cs4-preset-swatches">
            ${swKeys.map(k=>`<div class="cs4-swatch" style="background:${preset.colors[k]||"#222"}"></div>`).join("")}
          </div>
          <div class="cs4-preset-name">
            <span>${preset.emoji||"🎨"}</span>
            <span>${preset.builtin ? (t().presetNames?.[key] || preset.name) : preset.name}</span>
            ${preset.community ? `<span class="cs4-preset-badge-community">${t().badgeCommunity}</span>` : !preset.builtin ? `<span class="cs4-preset-badge">${t().badgeCustom}</span>` : ""}
          </div>
          ${!preset.builtin && !preset.community ? `<button class="cs4-preset-del" title="${t().deleteTitle}">✕</button>` : ""}`;
        el.addEventListener("click", e => {
          if (e.target.closest(".cs4-preset-del")) return;
          editColors = { ...preset.colors };
          activePresetKey = key;
          applyColors(editColors);
          saveColors(editColors);
          savePreset(key);
          renderPresets();
          syncPickers();
          setTimeout(() => { const s = document.getElementById(SECTION_ID); if (s) renderUI(s); }, 80);
          toast(t().toastPresetApplied(preset.builtin ? (t().presetNames?.[key] || preset.name) : preset.name));
        });
        const del = el.querySelector(".cs4-preset-del");
        if (del) {
          del.addEventListener("click", e => {
            e.stopPropagation();
            const customs = loadCustomPresets();
            delete customs[key];
            saveCustomPresets(customs);
            if (activePresetKey === key) { activePresetKey = "default"; savePreset("default"); }
            renderPresets();
            toast(t().toastPresetDeleted);
          });
        }
        grid.appendChild(el);
      });
    }
    renderPresets();

    const communityChk = document.getElementById("cs4-community-chk");
    if (communityChk) {
      communityChk.addEventListener("change", async () => {
        const enabled = communityChk.checked;
        setCommunityEnabled(enabled);
        if (enabled) {
          communityChk.disabled = true;
          communityChk.parentElement.style.opacity = "0.5";
          const presets = await fetchCommunityPresets();
          communityChk.disabled = false;
          communityChk.parentElement.style.opacity = "1";
          if (presets && Object.keys(presets).length > 0) {
            saveCommunityPresets(presets);
          } else {
            toast(t().communityNoneFound);
            setCommunityEnabled(false);
            communityChk.checked = false;
            return;
          }
        } else {
          saveCommunityPresets({});
        }
        setTimeout(() => {
          try { Spicetify.Platform.reload(); } catch (_) {
            try { window.location.reload(); } catch (__) {}
          }
        }, 400);
      });
    }

    function getAppVersions() {
      let spotifyV = "?", spicetifyV = "?";
      try {
        spotifyV =
          (Spicetify && Spicetify.Platform && Spicetify.Platform.version) ||
          (Spicetify && Spicetify.Platform && Spicetify.Platform.PlatformData && Spicetify.Platform.PlatformData.version) ||
          "?";
      } catch (_) {}
      try {
        spicetifyV =
          (Spicetify && Spicetify.Config && Spicetify.Config.version) ||
          (Spicetify && Spicetify.CONFIG && Spicetify.CONFIG.version) ||
          "?";
      } catch (_) {}
      return { spotifyV, spicetifyV, chrV: CURRENT_VERSION };
    }

    const versionsCopyBtn = document.getElementById("cs4-versions-copy-btn");
    if (versionsCopyBtn) {
      versionsCopyBtn.addEventListener("click", async () => {
        const v = getAppVersions();
        const text = `${v.spotifyV} ● ${v.spicetifyV} ● ${v.chrV}`;
        try {
          await navigator.clipboard.writeText(text);
          toast(t().versionsCopied);
        } catch (_) {
          toast(text);
        }
      });
    }

    document.getElementById("cs4-save-btn").addEventListener("click", () => {
      const ni = document.getElementById("cs4-pname");
      const name = ni.value.trim();
      if (!name) { toast(t().toastNoName); return; }
      const customs = loadCustomPresets();
      const key = "custom_" + Date.now();
      customs[key] = { name, emoji: "🎨", builtin: false, colors: { ...editColors } };
      saveCustomPresets(customs);
      ni.value = "";
      activePresetKey = key;
      savePreset(key);
      renderPresets();
      toast(t().toastPresetSaved(name));
    });
    const editorEl = document.getElementById("cs4-editor");
    const pickerRefs = {};

    function buildEditor() {
      editorEl.innerHTML = "";
      const groups = [...new Set(COLOR_DEFS.map(d => d.group))];
      groups.forEach(group => {
        const lbl = document.createElement("div");
        lbl.className = "cs4-group-label";
        lbl.textContent = t()[group] || group;
        editorEl.appendChild(lbl);

        const grid = document.createElement("div");
        grid.className = "cs4-colors-grid";

        COLOR_DEFS.filter(d => d.group === group).forEach(def => {
          const val = editColors[def.key] || "#000000";
          const row = document.createElement("div");
          row.className = "cs4-color-row";
          row.dataset.key = def.key;
          row.innerHTML = `
            <div class="cs4-color-circle" style="background:${val}">
              <input type="color" value="${val}" data-key="${def.key}">
            </div>
            <div class="cs4-color-lbl">${t().colorLabels[def.labelKey] || def.labelKey}</div>
            <input class="cs4-hex" value="${val}" maxlength="7" spellcheck="false" data-key="${def.key}">
            <button class="cs4-sl-btn" data-slkey="${def.key}" title="Slider HSL">HSL</button>
          `;

          const picker  = row.querySelector("input[type='color']");
          const circle  = row.querySelector(".cs4-color-circle");
          const hexInp  = row.querySelector(".cs4-hex");
          const slBtn   = row.querySelector(".cs4-sl-btn");
          pickerRefs[def.key] = { picker, circle, hexInp, row };

          function setColor(v) {
            editColors[def.key] = v;
            circle.style.background = v;
            if (picker.value !== v) picker.value = v;
            if (hexInp.value !== v) hexInp.value = v;
            hexInp.classList.remove("cs4-invalid");
            applyColors(editColors);
          }

          picker.addEventListener("input", e => setColor(e.target.value));
          picker.addEventListener("change", () => pushHistory());

          hexInp.addEventListener("input", e => {
            const raw = e.target.value.trim();
            if (isValidHex(raw)) { hexInp.classList.remove("cs4-invalid"); setColor(normalizeHex(raw)); }
            else hexInp.classList.add("cs4-invalid");
          });
          hexInp.addEventListener("blur", e => {
            if (!isValidHex(e.target.value)) { hexInp.value = editColors[def.key] || "#000000"; hexInp.classList.remove("cs4-invalid"); }
          });
          hexInp.addEventListener("change", e => {
            if (isValidHex(e.target.value)) pushHistory();
          });

          slBtn.addEventListener("click", e => {
            e.stopPropagation();
            openSlider(def.key, slBtn);
          });

          grid.appendChild(row);
        });
        editorEl.appendChild(grid);
      });
    }

    function syncPickers() {
      COLOR_DEFS.forEach(def => {
        const v = editColors[def.key] || "#000000";
        const r = pickerRefs[def.key];
        if (!r) return;
        r.picker.value = v;
        r.circle.style.background = v;
        r.hexInp.value = v;
        r.hexInp.classList.remove("cs4-invalid");
      });
    }
    function openSlider(key, anchor) {
      if (activeSliderPop) { activeSliderPop.remove(); activeSliderPop = null; }
      const hex = editColors[key] || "#1db954";
      const hsl = hexToHsl(hex);
      const pop = document.createElement("div");
      pop.className = "cs4-sl-popup";
      const defLabel = t().colorLabels[COLOR_DEFS.find(d => d.key === key)?.labelKey] || key;
      pop.innerHTML = `
        <div class="cs4-sl-title">${defLabel}</div>
        <div class="cs4-sl-row">
          <span class="cs4-sl-name">H</span>
          <input class="cs4-sl-track" id="cs4h" type="range" min="0" max="360" value="${hsl.h}"
            style="background:linear-gradient(to right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))">
          <span class="cs4-sl-val" id="cs4hv">${hsl.h}</span>
        </div>
        <div class="cs4-sl-row">
          <span class="cs4-sl-name">S</span>
          <input class="cs4-sl-track" id="cs4s" type="range" min="0" max="100" value="${hsl.s}"
            style="background:linear-gradient(to right,hsl(${hsl.h},0%,${hsl.l}%),hsl(${hsl.h},100%,${hsl.l}%))">
          <span class="cs4-sl-val" id="cs4sv">${hsl.s}</span>
        </div>
        <div class="cs4-sl-row">
          <span class="cs4-sl-name">L</span>
          <input class="cs4-sl-track" id="cs4l" type="range" min="0" max="100" value="${hsl.l}"
            style="background:linear-gradient(to right,#000,hsl(${hsl.h},${hsl.s}%,50%),#fff)">
          <span class="cs4-sl-val" id="cs4lv">${hsl.l}</span>
        </div>
      `;
      document.body.appendChild(pop);
      activeSliderPop = pop;

      const rect = anchor.getBoundingClientRect();
      pop.style.top  = Math.min(rect.bottom + 8, window.innerHeight - 200) + "px";
      pop.style.left = Math.min(rect.left, window.innerWidth - 252) + "px";

      const slH = pop.querySelector("#cs4h");
      const slS = pop.querySelector("#cs4s");
      const slL = pop.querySelector("#cs4l");

      function onSlide() {
        const h = +slH.value, s = +slS.value, l = +slL.value;
        pop.querySelector("#cs4hv").textContent = h;
        pop.querySelector("#cs4sv").textContent = s;
        pop.querySelector("#cs4lv").textContent = l;
        slS.style.background = `linear-gradient(to right,hsl(${h},0%,${l}%),hsl(${h},100%,${l}%))`;
        slL.style.background = `linear-gradient(to right,#000,hsl(${h},${s}%,50%),#fff)`;
        const newHex = hslToHex(h, s, l);
        const r = pickerRefs[key];
        if (!r) return;
        editColors[key] = newHex;
        r.circle.style.background = newHex;
        r.picker.value = newHex;
        r.hexInp.value = newHex;
        r.hexInp.classList.remove("cs4-invalid");
        applyColors(editColors);
      }
      [slH, slS, slL].forEach(s => {
        s.addEventListener("input", onSlide);
        s.addEventListener("change", () => pushHistory());
      });

      setTimeout(() => {
        function close(e) {
          if (!pop.contains(e.target) && e.target !== anchor) {
            pop.remove(); activeSliderPop = null;
            document.removeEventListener("click", close);
          }
        }
        document.addEventListener("click", close);
      }, 50);
    }

    buildEditor();
    buildCloudPanel();


    function buildCloudPanel() {
      const wrap = document.getElementById("cs4-cloud-container");
      if (!wrap) return;
      const creds = cloudGetCreds();
      wrap.innerHTML = creds ? renderConnected(creds.email) : renderLogin();
      wireCloud();
    }

    function renderLogin() {
      const tr2 = t();
      return `
        <div style="max-width:380px;padding-top:4px;margin:0 auto;">
          <div style="background:rgba(29,185,84,.07);border:1px solid rgba(29,185,84,.18);border-radius:12px;padding:14px 16px;margin-bottom:18px;">
            <div style="font-size:13px;font-weight:700;color:${acc};margin-bottom:5px;">${tr2.cloud.title}</div>
            <div style="font-size:12px;color:${sub};line-height:1.6;">${tr2.cloud.desc}</div>
          </div>
          <div id="cs4-cloud-alert" style="display:none;border-radius:8px;padding:9px 12px;font-size:12px;margin-bottom:12px;font-family:monospace;"></div>
          <div style="margin-bottom:11px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:${sub};margin-bottom:5px;">${tr2.cloud.emailLabel}</div>
            <input id="cs4-cloud-email" type="email" placeholder="you@example.com"
              style="width:100%;background:${hl};border:1.5px solid ${hlEl};border-radius:8px;padding:9px 12px;font-size:13px;color:${txt};outline:none;box-sizing:border-box;"
              onfocus="this.style.borderColor='${acc}'" onblur="this.style.borderColor='${hlEl}'">
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-size:10px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:${sub};margin-bottom:5px;">${tr2.cloud.pwLabel}</div>
            <input id="cs4-cloud-pw" type="password" placeholder="••••••••"
              style="width:100%;background:${hl};border:1.5px solid ${hlEl};border-radius:8px;padding:9px 12px;font-size:13px;color:${txt};outline:none;box-sizing:border-box;"
              onfocus="this.style.borderColor='${acc}'" onblur="this.style.borderColor='${hlEl}'">
          </div>
          <button id="cs4-cloud-login" class="cs4-btn cs4-btn-primary" style="width:100%;">${tr2.cloud.connectBtn}</button>
        </div>`;
    }

    function renderConnected(email) {
      const tr2 = t();
      return `
        <div style="max-width:380px;padding-top:4px;margin:0 auto;">
          <div style="background:rgba(29,185,84,.07);border:1px solid rgba(29,185,84,.18);border-radius:12px;padding:14px 16px;margin-bottom:18px;display:flex;align-items:center;gap:11px;">
            <div style="width:34px;height:34px;border-radius:50%;background:rgba(29,185,84,.15);border:1px solid rgba(29,185,84,.3);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;">✓</div>
            <div>
              <div style="font-size:12px;font-weight:700;color:${acc};">${tr2.cloud.connected}</div>
              <div style="font-size:11px;color:${sub};font-family:monospace;margin-top:1px;">${email}</div>
            </div>
          </div>
          <div id="cs4-cloud-alert" style="display:none;border-radius:8px;padding:9px 12px;font-size:12px;margin-bottom:12px;font-family:monospace;"></div>
          <div style="display:flex;flex-direction:column;gap:9px;margin-bottom:18px;">
            <button id="cs4-cloud-push" class="cs4-btn cs4-btn-primary" style="width:100%;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              ${tr2.cloud.pushBtn}
            </button>
            <button id="cs4-cloud-pull" class="cs4-btn cs4-btn-secondary" style="width:100%;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              ${tr2.cloud.pullBtn}
            </button>
          </div>
          <button id="cs4-cloud-disconnect" class="cs4-btn cs4-btn-danger" style="width:100%;">${tr2.cloud.disconnectBtn}</button>
        </div>`;
    }

    function showCloudMsg(type, msg) {
      const el = document.getElementById("cs4-cloud-alert");
      if (!el) return;
      el.textContent = msg;
      el.style.display = "block";
      el.style.background = type === "ok" ? "rgba(29,185,84,.1)" : "rgba(232,67,147,.1)";
      el.style.border     = type === "ok" ? "1px solid rgba(29,185,84,.3)" : "1px solid rgba(232,67,147,.3)";
      el.style.color      = type === "ok" ? acc : "#e84393";
      clearTimeout(el._t);
      el._t = setTimeout(() => { el.style.display = "none"; }, 4000);
    }

    function wireCloud() {
      const loginBtn = document.getElementById("cs4-cloud-login");
      if (loginBtn) {
        loginBtn.addEventListener("click", async () => {
          const email = (document.getElementById("cs4-cloud-email") || {}).value || "";
          const pw    = (document.getElementById("cs4-cloud-pw") || {}).value || "";
          if (!email || !pw) { showCloudMsg("err", t().cloud.fillFields); return; }
          loginBtn.textContent = t().cloud.connecting;
          loginBtn.disabled = true;
          const res = await cloudLogin(email.trim(), pw);
          if (!res.ok) {
            loginBtn.textContent = t().cloud.connectBtn;
            loginBtn.disabled = false;
            showCloudMsg("err", res.error);
            return;
          }
          buildCloudPanel();
        });
      }

      const pushBtn = document.getElementById("cs4-cloud-push");
      if (pushBtn) {
        pushBtn.addEventListener("click", async () => {
          pushBtn.disabled = true;
          pushBtn.textContent = t().cloud.pushing;
          const res = await cloudPush();
          pushBtn.disabled = false;
          pushBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> ${t().cloud.pushBtn}`;
          if (!res.ok) { showCloudMsg("err", res.error); return; }
          showCloudMsg("ok", res.count + " " + t().cloud.pushed);
        });
      }

      const pullBtn = document.getElementById("cs4-cloud-pull");
      if (pullBtn) {
        pullBtn.addEventListener("click", async () => {
          pullBtn.disabled = true;
          pullBtn.textContent = t().cloud.pulling;
          const res = await cloudPull();
          pullBtn.disabled = false;
          pullBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${t().cloud.pullBtn}`;
          if (!res.ok) { showCloudMsg("err", res.error); return; }
          showCloudMsg("ok", res.count + " " + t().cloud.pulled);
          setTimeout(() => {
            try { Spicetify.Platform.reload(); } catch(_) {
              try { window.location.reload(); } catch(__) {}
            }
          }, 1200);
        });
      }

      const discBtn = document.getElementById("cs4-cloud-disconnect");
      if (discBtn) {
        discBtn.addEventListener("click", () => {
          cloudClearCreds();
          buildCloudPanel();
        });
      }
    }

    document.getElementById("cs4-apply").addEventListener("click", () => {
      applyColors(editColors); saveColors(editColors); toast(t().toastSaved);
    });
    document.getElementById("cs4-reset").addEventListener("click", () => {
      const p = getAllPresets()[activePresetKey] || BUILTIN_PRESETS.default;
      editColors = { ...p.colors };
      syncPickers(); applyColors(editColors);
      pushHistory();
      toast(t().toastReset);
    });
    document.getElementById("cs4-undo").addEventListener("click", undo);
    document.getElementById("cs4-redo").addEventListener("click", redo);
    document.getElementById("cs4-default").addEventListener("click", () => {
      editColors = { ...BUILTIN_PRESETS.default.colors };
      activePresetKey = "default";
      syncPickers(); applyColors(editColors); saveColors(editColors); savePreset("default");
      setTimeout(() => { const s = document.getElementById(SECTION_ID); if (s) renderUI(s); }, 80);
      toast(t().toastDefault);
    });
  }


