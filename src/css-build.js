  function buildCSS(c) {
    const t        = c.csText              || "#ffffff";
    const sub      = c.csSubtext           || "#a7a7a7";
    const bg       = c.csMain              || "#121212";
    const bgEl     = c.csMainElevated      || "#1a1a1a";
    const hl       = c.csHighlight         || "#282828";
    const hlEl     = c.csHighlightElevated || "#3e3e3e";
    const acc      = c.csAccent            || "#1db954";
    const btn      = luminance(acc) > 0.179 ? adjustColor(acc, -0.15) : adjustColor(acc, 0.15);
    const pbtn     = c.csPlayButton        || c.csButton || "#1db954";
    const pbtnHov  = c.csPlayButtonHover   || adjustColor(pbtn, 0.1);
    const btnD     = c.csButtonDisabled    || "#535353";
    const side     = c.csSidebar           || "#000000";
    const play     = c.csPlayer            || "#121212";
    const card     = c.csCard              || "#181818";
    const cardHov  = c.csCardHover         || adjustColor(card, 0.08);
    const notif    = c.csNotification      || "#3d91f4";
    const notifBg   = "#ffffff";
    const notifText = c.csNotificationText || "#000000";
    const progBg   = c.csProgressBg        || hl;
    const progFg   = c.csProgressFg        || acc;
    const volBg    = c.csVolumeBg          || hl;
    const volFg    = c.csVolumeFg          || acc;

    const accActive  = adjustColor(acc, 0.08);
    const btnActive  = adjustColor(btn, 0.08);
    const bgPress    = adjustColor(bg, -0.05);
    const bgTinted   = adjustColor(bg, 0.04);
    const bgTintedHl = adjustColor(bg, 0.09);
    const decorBase  = adjustColor(acc, -0.15);
    const decorSub   = adjustColor(acc, -0.25);
    const pbtnText   = contrastColor(pbtn);
    const btnText    = contrastColor(btn);

    return `
:root,.Root__top-bar,.Root__nav-bar,.Root__main-view,.Root__now-playing-bar,
.Root__globalNav,.main-view-container,[class*="main-view"],[class*="Root__"]{
  --spice-text:${t}!important;--spice-subtext:${sub}!important;
  --spice-extratext:${sub}!important;--spice-main:${bg}!important;
  --spice-main-elevated:${bgEl}!important;--spice-main-transition:${bg}!important;
  --spice-highlight:${hl}!important;--spice-highlight-elevated:${hlEl}!important;
  --background-highlight:${hl}!important;
  --spice-sidebar:${side}!important;--spice-player:${play}!important;
  --spice-card:${card}!important;--spice-button:${btn}!important;
  --spice-button-active:${btnActive}!important;--spice-button-disabled:${btnD}!important;
  --spice-accent:${acc}!important;--spice-accent-active:${accActive}!important;
  --spice-tab-active:${side}!important;--spice-notification:${notif}!important;
  --spice-notification-error:#e5534b!important;--spice-misc:${hl}!important;
  --spice-shadow:rgba(0,0,0,.5)!important;
  --spice-rgb-text:${hexToRgb(t)}!important;--spice-rgb-subtext:${hexToRgb(sub)}!important;
  --spice-rgb-main:${hexToRgb(bg)}!important;--spice-rgb-main-elevated:${hexToRgb(bgEl)}!important;
  --spice-rgb-highlight:${hexToRgb(hl)}!important;--spice-rgb-highlight-elevated:${hexToRgb(hlEl)}!important;
  --spice-rgb-sidebar:${hexToRgb(side)}!important;--spice-rgb-player:${hexToRgb(play)}!important;
  --spice-rgb-card:${hexToRgb(card)}!important;--spice-rgb-button:${hexToRgb(btn)}!important;
  --spice-rgb-button-active:${hexToRgb(btnActive)}!important;
  --spice-rgb-accent:${hexToRgb(acc)}!important;--spice-rgb-notification:${hexToRgb(notif)}!important;
}
.encore-dark-theme{
  --background-highlight:${hl}!important;
}
.encore-bright-accent-set[class*="playButton"],
.encore-bright-accent-set[class*="PlayButton"],
.encore-bright-accent-set[data-testid="play-button"]{
  --background-highlight:${pbtnHov}!important;
}
.x-settings-zoomRadioCircle:hover,
.x-settings-zoomRadioCircle:active{
  border-color:transparent!important;
}
:root,[class*="encore-"]{
  --encore-base-color-text-base:${t}!important;
  --encore-base-color-text-subdued:${sub}!important;
  --encore-base-color-text-bright-accent:${acc}!important;
  --encore-base-color-text-negative:#e5534b!important;
  --encore-base-color-text-warning:#e8740c!important;
  --encore-base-color-text-positive:${acc}!important;
  --encore-base-color-text-announcement:${notif}!important;
  --encore-base-color-background-base:${bg}!important;
  --encore-base-color-background-highlight:${hl}!important;
  --encore-base-color-background-press:${bgPress}!important;
  --encore-base-color-background-elevated-base:${bgEl}!important;
  --encore-base-color-background-elevated-highlight:${hlEl}!important;
  --encore-base-color-background-tinted-base:${bgTinted}!important;
  --encore-base-color-background-tinted-highlight:${bgTintedHl}!important;
  --encore-base-color-background-unsafe-for-small-text-base:${bg}!important;
  --encore-base-color-background-unsafe-for-small-text-highlight:${hl}!important;
  --encore-base-color-essential-base:${t}!important;
  --encore-base-color-essential-subdued:${sub}!important;
  --encore-base-color-essential-bright-accent:${acc}!important;
  --encore-base-color-essential-negative:#e5534b!important;
  --encore-base-color-essential-warning:#e8740c!important;
  --encore-base-color-essential-positive:${acc}!important;
  --encore-base-color-essential-announcement:${notif}!important;
  --encore-base-color-decorative-base:${decorBase}!important;
  --encore-base-color-decorative-subdued:${decorSub}!important;
  --encore-color-text-base:${t}!important;
  --encore-color-text-subdued:${sub}!important;
  --encore-color-text-bright-accent:${acc}!important;
  --encore-color-text-negative:#e5534b!important;
  --encore-color-text-positive:${acc}!important;
  --encore-color-text-warning:#e8740c!important;
  --encore-color-text-announcement:${notif}!important;
  --encore-color-background-base:${bg}!important;
  --encore-color-background-highlight:${hl}!important;
  --encore-color-background-press:${bgPress}!important;
  --encore-color-background-elevated-base:${bgEl}!important;
  --encore-color-background-elevated-highlight:${hlEl}!important;
  --encore-color-background-tinted-base:${bgTinted}!important;
  --encore-color-background-tinted-highlight:${bgTintedHl}!important;
  --encore-color-essential-base:${t}!important;
  --encore-color-essential-subdued:${sub}!important;
  --encore-color-essential-bright-accent:${acc}!important;
  --encore-color-essential-negative:#e5534b!important;
  --encore-color-essential-positive:${acc}!important;
  --encore-color-decorative-base:${decorBase}!important;
  --encore-color-decorative-subdued:${decorSub}!important;
  --e-91000-color-text-base:${t}!important;
  --e-91000-color-text-subdued:${sub}!important;
  --e-91000-color-text-bright-accent:${acc}!important;
  --e-91000-color-background-base:${bg}!important;
  --e-91000-color-background-highlight:${hl}!important;
  --e-91000-color-background-elevated-base:${bgEl}!important;
  --e-91000-color-background-elevated-highlight:${hlEl}!important;
  --e-91000-color-essential-base:${t}!important;
  --e-91000-color-essential-subdued:${sub}!important;
  --e-91000-color-essential-bright-accent:${acc}!important;
}
.encore-light-theme{
  --encore-base-color-text-base:${notifText}!important;
  --encore-base-color-text-subdued:${notifText}!important;
  --encore-base-color-essential-base:${notifText}!important;
  --encore-base-color-background-base:${notifBg}!important;
  --encore-base-color-background-elevated-base:${notifBg}!important;
  --encore-color-text-base:${notifText}!important;
  --encore-color-essential-base:${notifText}!important;
  --encore-color-background-base:${notifBg}!important;
  --encore-color-background-elevated-base:${notifBg}!important;
  --e-91000-color-text-base:${notifText}!important;
  --e-91000-color-essential-base:${notifText}!important;
  --e-91000-color-background-base:${notifBg}!important;
  --e-91000-color-background-elevated-base:${notifBg}!important;
}
.notistack-Snackbar [data-encore-id="box"],
[role="dialog"] .encore-light-theme{
  background-color:${notifBg}!important;
}
.notistack-Snackbar [data-encore-id="text"],
.notistack-Snackbar [data-encore-id="box"] *,
[role="dialog"] .encore-light-theme [data-encore-id="text"]{
  color:${notifText}!important;
}
[role="dialog"] .encore-light-theme [data-encore-id="buttonTertiary"]{
  color:${sub}!important;
}
.Root__nav-bar,.nav-bar,[class*="navBar"],[class*="sidebar"],
[class*="globalNav"],[class*="GlobalNav"],
.LayoutResizer__resize-bar+*{background-color:${side}!important}
body:not(.cs4-sbl-active) .Root__main-view,
body:not(.cs4-sbl-active) .main-view-container__scroll-node:not(:has(.before-scroll-node)),
body:not(.cs4-sbl-active) [class*="scroll-node"]:not([class*="child"]):not(:has(.before-scroll-node)),
body:not(.cs4-sbl-active) [class*="contentSpacing"]:not(:has(.search-searchCategory-contentArea)){background-color:${bg}!important}
body.cs4-sbl-active .Root__main-view:not(:has(.lyrics-lyrics-container)),
body.cs4-sbl-active .main-view-container__scroll-node:not(:has(.lyrics-lyrics-container)):not(:has(.before-scroll-node)),
body.cs4-sbl-active [class*="scroll-node"]:not([class*="child"]):not(:has(.lyrics-lyrics-container)):not(:has(.before-scroll-node)),
body.cs4-sbl-active [class*="contentSpacing"]:not(:has(.search-searchCategory-contentArea)):not(:has(.lyrics-lyrics-container)){background-color:${bg}!important}
body:not(.cs4-sbl-active) .main-view-container:has(.before-scroll-node) [class*="contentSpacing"],
body.cs4-sbl-active .main-view-container:has(.before-scroll-node) [class*="contentSpacing"]{
  background-color:transparent!important;
}
body:not(.cs4-sbl-active) .main-view-container:has(.before-scroll-node) .main-view-container__scroll-node,
body.cs4-sbl-active .main-view-container:has(.before-scroll-node) .main-view-container__scroll-node{
  background-color:transparent!important;
}
.main-topBar-topbarContentContainer{background-color:transparent!important}
.Root__now-playing-bar,.now-playing-bar,[class*="nowPlayingBar"]{background-color:${play}!important}

.Root__top-bar{
  background-color:transparent!important;
  background-image:none!important;
  box-shadow:none!important;
}
.main-topBar-container,
[data-testid="topbar-background"],
[class*="topBar__background"],
[class*="topBarBackground"],
.main-topBar-background,
[class*="topBar__overlay"],
[class*="topBarOverlay"]{
  background-color:transparent!important;
  background-image:none!important;
  backdrop-filter:none!important;
  -webkit-backdrop-filter:none!important;
  box-shadow:none!important;
}

:root,[class*="Root__"]{
  --progress-bar-indicator-color:${progFg}!important;
  --progress-bar-height:4px!important;
  --volume-bar-color:${volFg}!important;
}

[data-testid="progress-bar"],[data-testid="playback-progressbar"]{cursor:pointer}
.x-progressBar-background{background-color:${progBg}!important;height:4px!important;border-radius:2px!important;transition:height .12s!important}
.x-progressBar-middleground{background-color:${progBg}!important}
.x-progressBar-foreground{background-color:${progFg}!important;height:4px!important;border-radius:2px!important;min-width:2px!important;transition:background-color .15s,height .12s!important}
.x-progressBar-handle{background-color:${progFg}!important;width:12px!important;height:12px!important;border-radius:50%!important;opacity:1!important;transition:transform .12s,background-color .15s!important}
[data-testid="progress-bar"]:hover .x-progressBar-background,[data-testid="playback-progressbar"]:hover .x-progressBar-background{height:5px!important}
[data-testid="progress-bar"]:hover .x-progressBar-foreground,[data-testid="playback-progressbar"]:hover .x-progressBar-foreground{background-color:${adjustColor(progFg,0.12)}!important;height:5px!important}
[data-testid="progress-bar"]:hover .x-progressBar-handle,[data-testid="playback-progressbar"]:hover .x-progressBar-handle{background-color:${adjustColor(progFg,0.12)}!important}
.progressBar-background{background-color:${progBg}!important;height:4px!important;border-radius:2px!important;transition:height .12s!important}
.progressBar-middleground{background-color:${progBg}!important}
.progressBar-foreground{background-color:${progFg}!important;height:4px!important;border-radius:2px!important;min-width:2px!important;transition:background-color .15s,height .12s!important}
.progressBar-handle{background-color:${progFg}!important;width:12px!important;height:12px!important;border-radius:50%!important;opacity:1!important;transition:transform .12s,background-color .15s!important}
[data-testid="progress-bar"]:hover .progressBar-background,[data-testid="playback-progressbar"]:hover .progressBar-background{height:5px!important}
[data-testid="progress-bar"]:hover .progressBar-foreground,[data-testid="playback-progressbar"]:hover .progressBar-foreground{background-color:${adjustColor(progFg,0.12)}!important;height:5px!important}
[data-testid="progress-bar"]:hover .progressBar-handle,[data-testid="playback-progressbar"]:hover .progressBar-handle{background-color:${adjustColor(progFg,0.12)}!important}
[data-testid="progress-bar"] .x-progressBar-progressBarBg,
[data-testid="playback-progressbar"] .x-progressBar-progressBarBg,
[data-testid="progress-bar-background"]{
  background-color:${progBg}!important;transition:background-color .15s!important;
}
[data-testid="progress-bar"] .x-progressBar-progressFillColor,
[data-testid="playback-progressbar"] .x-progressBar-progressFillColor{
  background-color:${progBg}!important;transition:background-color .15s!important;
}
[data-testid="progress-bar"] .x-progressBar-fillColor,
[data-testid="playback-progressbar"] .x-progressBar-fillColor{
  background-color:${progFg}!important;transition:background-color .15s!important;
}
[data-testid="progress-bar"] .progress-bar__slider,
[data-testid="playback-progressbar"] .progress-bar__slider,
[data-testid="progress-bar-handle"]{
  background-color:${progFg}!important;opacity:1!important;
  transition:background-color .15s,transform .12s!important;
}
[data-testid="progress-bar"]:hover .x-progressBar-fillColor,
[data-testid="playback-progressbar"]:hover .x-progressBar-fillColor{
  background-color:${adjustColor(progFg,0.12)}!important;
}
[data-testid="progress-bar"]:hover .progress-bar__slider,
[data-testid="playback-progressbar"]:hover .progress-bar__slider{
  background-color:${adjustColor(progFg,0.12)}!important;
}

[data-testid="volume-bar"] .x-progressBar-background,
[data-testid="volume-bar"] ~ * .x-progressBar-background,
[class*="volume"] .x-progressBar-background{background-color:${volBg}!important}
[data-testid="volume-bar"] .x-progressBar-foreground,
[data-testid="volume-bar"] ~ * .x-progressBar-foreground,
[class*="volume"] .x-progressBar-foreground{background-color:${volFg}!important;transition:background-color .15s!important}
[data-testid="volume-bar"]:hover .x-progressBar-foreground,
[class*="volume"]:hover .x-progressBar-foreground{background-color:${adjustColor(volFg,0.12)}!important}
[data-testid="volume-bar"] .x-progressBar-handle,
[class*="volume"] .x-progressBar-handle{background-color:${volFg}!important;opacity:1!important;transition:background-color .15s,transform .12s!important}
[data-testid="volume-bar"]:hover .x-progressBar-handle,
[class*="volume"]:hover .x-progressBar-handle{background-color:${adjustColor(volFg,0.12)}!important}
[data-testid="volume-bar"] .progressBar-background,
[data-testid="volume-bar"] ~ * .progressBar-background,
[class*="volume"] .progressBar-background{background-color:${volBg}!important}
[data-testid="volume-bar"] .progressBar-foreground,
[data-testid="volume-bar"] ~ * .progressBar-foreground,
[class*="volume"] .progressBar-foreground{background-color:${volFg}!important;transition:background-color .15s!important}
[data-testid="volume-bar"]:hover .progressBar-foreground,
[class*="volume"]:hover .progressBar-foreground{background-color:${adjustColor(volFg,0.12)}!important}
[data-testid="volume-bar"] .progressBar-handle,
[class*="volume"] .progressBar-handle{background-color:${volFg}!important;opacity:1!important;transition:background-color .15s,transform .12s!important}
[data-testid="volume-bar"]:hover .progressBar-handle,
[class*="volume"]:hover .progressBar-handle{background-color:${adjustColor(volFg,0.12)}!important}
[data-testid="volume-bar"] .x-progressBar-progressBarBg,
[class*="volume"] .x-progressBar-progressBarBg{background-color:${volBg}!important}
[data-testid="volume-bar"] .x-progressBar-progressFillColor,
[class*="volume"] .x-progressBar-progressFillColor{background-color:${volBg}!important;transition:background-color .15s!important}
[data-testid="volume-bar"] .x-progressBar-fillColor,
[class*="volume"] .x-progressBar-fillColor{background-color:${volFg}!important;transition:background-color .15s!important}
[data-testid="volume-bar"] .progress-bar__slider,
[class*="volume"] .progress-bar__slider{background-color:${volFg}!important;opacity:1!important;transition:background-color .15s,transform .12s!important}
[data-testid="volume-bar"]:hover .x-progressBar-fillColor,
[class*="volume"]:hover .x-progressBar-fillColor{background-color:${adjustColor(volFg,0.12)}!important}
[data-testid="volume-bar"]:hover .progress-bar__slider,
[class*="volume"]:hover .progress-bar__slider{background-color:${adjustColor(volFg,0.12)}!important}

.main-playButton-PlayButton:not([data-testid="control-button-playpause"]),
[data-testid="play-button"]{
  opacity:0!important;
  background-color:transparent!important;
  box-shadow:none!important;
  transform:scale(.85)!important;
  pointer-events:none!important;
  transition:opacity .15s,transform .15s!important;
}
*:hover > .main-playButton-PlayButton,
*:hover > [data-testid="play-button"],
*:hover .main-playButton-PlayButton,
*:hover [data-testid="play-button"]{
  opacity:1!important;
  transform:scale(1)!important;
  pointer-events:all!important;
}

[data-testid="home-page"] .main-playButton-PlayButton:not([data-testid="control-button-playpause"]),
[data-testid="home-page"] [data-testid="play-button"]{
  background-color:transparent!important;
  box-shadow:none!important;
}
[data-testid="home-page"] .kyJXPKlxWxJleoZlsuUa .main-playButton-PlayButton{
  opacity:0!important;
}
[data-testid="home-page"] .kyJXPKlxWxJleoZlsuUa:hover .main-playButton-PlayButton{
  opacity:1!important;
}
[data-testid="control-button-playpause"]{
  background-color:${pbtn}!important;color:${pbtnText}!important;
  border-radius:50%!important;border:none!important;
  opacity:1!important;transform:none!important;pointer-events:auto!important;
}
[data-testid="control-button-playpause"]:hover{
  background-color:${pbtnHov}!important;
}
[data-testid="control-button-playpause"] svg{
  fill:${pbtnText}!important;color:${pbtnText}!important;
}
.main-actionBar-ActionBar .main-playButton-PlayButton,
.main-actionBar-ActionBar [data-testid="play-button"],
[class*="actionBar"] .main-playButton-PlayButton,
[class*="actionBar"] [data-testid="play-button"],
[class*="ActionBar"] .main-playButton-PlayButton,
[class*="ActionBar"] [data-testid="play-button"],
[class*="entityHeader"] .main-playButton-PlayButton,
[class*="entityHeader"] [data-testid="play-button"],
[class*="EntityHeader"] .main-playButton-PlayButton,
[class*="EntityHeader"] [data-testid="play-button"]{
  background-color:${pbtn}!important;color:${pbtnText}!important;
  border-radius:50%!important;border:none!important;
  opacity:1!important;transform:none!important;pointer-events:auto!important;
}
[class*="actionBar"] .main-playButton-PlayButton svg,
[class*="ActionBar"] .main-playButton-PlayButton svg,
[class*="entityHeader"] .main-playButton-PlayButton svg,
[class*="EntityHeader"] .main-playButton-PlayButton svg{
  fill:${pbtnText}!important;color:${pbtnText}!important;
}
[class*="actionBar"] .main-playButton-PlayButton:hover,
[class*="ActionBar"] .main-playButton-PlayButton:hover,
[class*="entityHeader"] .main-playButton-PlayButton:hover,
[class*="EntityHeader"] .main-playButton-PlayButton:hover,
*:hover > .main-playButton-PlayButton:hover,
*:hover .main-playButton-PlayButton:hover,
*:hover > [data-testid="play-button"]:hover,
*:hover [data-testid="play-button"]:hover{
  background-color:${pbtnHov}!important;
}

[class*="heart"][aria-checked="true"],[class*="follow"][data-encore-id][class*="active"],
[class*="Button--is-active"]{color:${acc}!important}

.main-card-card,[class*="CardComponent"],
[data-testid="card-container"]{background-color:${card}!important;transition:background-color .2s,transform .18s,box-shadow .2s!important}
.main-card-card:hover,[class*="CardComponent"]:hover,
[data-testid="card-container"]:hover,[class*="gridItem"]:hover [data-testid="card-container"],
[class*="gridItem"]:hover [class*="CardComponent"]{background-color:${cardHov}!important;
transform:translateY(-3px) scale(1.013)!important;box-shadow:0 8px 28px rgba(0,0,0,.45)!important}
[class*="gridItem"]:hover [data-testid="card-container"] *,
[class*="gridItem"]:hover [class*="CardComponent"] *{transform:none!important}


[class*="TrackListRow"]:hover,[class*="tracklist-row"]:hover,
[data-testid="tracklist-row"]:hover,
.main-trackList-trackListRow:hover{background-color:${hl}!important}
[class*="TrackListRow"][aria-selected="true"],
[data-testid="tracklist-row"][aria-selected="true"],
.main-trackList-trackListRow[aria-selected="true"]{background-color:${hlEl}!important}
[class*="contextMenu"],[class*="ContextMenu"],
[data-testid*="context-menu"]{background-color:${bgEl}!important}
.main-contextMenu-menuItemButton:hover,
.main-contextMenu-menuItemButton:focus,
.main-contextMenu-menuItemButton:hover .main-contextMenu-menuItemLabel,
.main-contextMenu-menuItemButton:focus .main-contextMenu-menuItemLabel,
.main-contextMenu-menuItemButton:hover > div,
.main-contextMenu-menuItemButton:focus > div,
.main-contextMenu-menuItemButton:hover .main-contextMenu-menuItemIconWrapper,
.main-contextMenu-menuItemButton:focus .main-contextMenu-menuItemIconWrapper,
.main-contextMenu-menuItemButton:hover .main-contextMenu-menuItemIconWrapper *,
.main-contextMenu-menuItemButton:focus .main-contextMenu-menuItemIconWrapper *{
  background-color:${hl}!important;
}

[class*="Type__"],[class*="encore-text"],.main-trackList-rowTitle,
.main-trackList-rowSectionStart{color:${t}!important}
[class*="encore-text-subdued"],[class*="Type__subdued"],
.main-trackList-rowSubTitle,
[data-testid="tracklist-row"] [class*="encore-text"]:not([class*="bold"]){color:${sub}!important}
.main-image-image + .standalone-ellipsis-one-line{color:${notifText}!important}

:root,[class*="Root__"]{
  --spice-equalizer:${acc}!important;
  --progress-bar-color:${acc}!important;
  --progress-bar-handle-color:${acc}!important;
}

.main-trackList-trackListRow:hover .main-trackList-rowSectionIndex svg,
[data-testid="tracklist-row"]:hover [class*="rowIndex"] svg,
[data-testid="tracklist-row"]:hover [class*="trackIndex"] svg,
[data-testid="queue-row"]:hover [class*="trackNumber"] svg,
[data-testid="queue-row"][aria-current] [class*="trackNumber"] svg{
  color:${acc}!important;fill:${acc}!important}

[class*="ButtonPrimary"]:not([class*="play"]):not([data-testid*="play"]),
[data-encore-id="buttonPrimary"]:not([class*="play"]):not([data-testid*="play"]){
  background-color:${btn}!important;color:${btnText}!important;border-radius:500px!important}
[class*="ButtonPrimary"]:not([class*="play"]):hover,
[data-encore-id="buttonPrimary"]:not([class*="play"]):hover{background-color:${btnActive}!important}

::-webkit-scrollbar{width:8px!important}
::-webkit-scrollbar-track{background:${bg}!important}
::-webkit-scrollbar-thumb{background:${hl}!important;border-radius:4px!important}
::-webkit-scrollbar-thumb:hover{background:${hlEl}!important}

.main-globalNav-searchInputTextWrapper,
.main-globalNav-searchInputTextWrapper *:not(kbd):not(kbd *){
  background-color:transparent!important;
  box-shadow:none!important;
}
.main-globalNav-browseButtonWrapper,
.main-globalNav-browseButtonWrapper *{
  background-color:transparent!important;
  box-shadow:none!important;
}
[data-testid="search-bar-text-input"],
input[class*="searchInput"]:not([class*="topbar"]),
.x-filterBox-filterInput{
  background-color:${bgEl}!important;color:${t}!important;
  border:1.5px solid ${hlEl}!important;border-radius:500px!important;
  transition:border-color .15s,box-shadow .15s!important}
[data-testid="search-bar-text-input"]:focus,
input[class*="searchInput"]:focus,
.x-filterBox-filterInput:focus{
  border-color:${acc}!important;box-shadow:0 0 0 2px ${acc}33!important;outline:none!important}
[data-testid="search-bar-text-input"]::placeholder,
input[class*="searchInput"]::placeholder,
.x-filterBox-filterInput::placeholder{color:${sub}!important;opacity:1!important}
[data-testid="search-bar-text-input"] ~ [class*="searchIcon"],
[data-testid="search-bar-text-input"] ~ [data-testid="search-icon"]{
  color:${sub}!important;fill:${sub}!important}
[data-testid="search-category-tab"],[class*="searchCategory-tab"],[class*="categoryTab"]{
  background-color:${hl}!important;color:${t}!important;
  border-radius:500px!important;transition:background-color .15s!important}
[data-testid="search-category-tab"][aria-selected="true"],
[class*="searchCategory-tab--active"],[class*="categoryTab--active"]{
  background-color:${acc}!important;color:${contrastColor(acc)}!important}

`;
  }

  function applyCSS(colors) { styleEl.textContent = buildCSS(colors); }


