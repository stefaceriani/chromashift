  // ===========================================================
  // PRESETS
  // ===========================================================

  const BUILTIN_PRESETS = {
    default: {
      name: "Spotify Default", emoji: "🟢", builtin: true,
      colors: {
        csText: "#ffffff", csSubtext: "#a7a7a7",
        csMain: "#121212", csMainElevated: "#1a1a1a",
        csHighlight: "#282828", csHighlightElevated: "#3e3e3e",
        csAccent: "#1db954", csPlayButton: "#1db954", csPlayButtonHover: "#1ed760",
        csButtonDisabled: "#535353", csSidebar: "#000000",
        csPlayer: "#121212", csCard: "#181818", csCardHover: "#282828",
        csNotification: "#3d91f4", csNotificationText: "#000000", csProgressBg: "#3e3e3e", csProgressFg: "#1db954", csVolumeBg: "#3e3e3e", csVolumeFg: "#1db954",
      },
    },
    midnight: {
      name: "Midnight Blue", emoji: "🔵", builtin: true,
      colors: {
        csText: "#e8eaf6", csSubtext: "#9fa8da",
        csMain: "#0a0e1a", csMainElevated: "#0f1629",
        csHighlight: "#1a2035", csHighlightElevated: "#253050",
        csAccent: "#5c6bc0", csPlayButton: "#5c6bc0", csPlayButtonHover: "#7986cb",
        csButtonDisabled: "#37474f", csSidebar: "#070b14",
        csPlayer: "#0a0e1a", csCard: "#111827", csCardHover: "#1e2d45",
        csNotification: "#5c6bc0", csNotificationText: "#000000", csProgressBg: "#253050", csProgressFg: "#5c6bc0", csVolumeBg: "#253050", csVolumeFg: "#5c6bc0",
      },
    },
    rose: {
      name: "Rose Gold", emoji: "🌸", builtin: true,
      colors: {
        csText: "#fdf2f8", csSubtext: "#f9a8d4",
        csMain: "#1a0a0f", csMainElevated: "#2a1018",
        csHighlight: "#3d1a25", csHighlightElevated: "#5c2535",
        csAccent: "#e879a0", csPlayButton: "#e879a0", csPlayButtonHover: "#f48fb1",
        csButtonDisabled: "#4a2030", csSidebar: "#110508",
        csPlayer: "#1a0a0f", csCard: "#21101a", csCardHover: "#3d1a2a",
        csNotification: "#e879a0", csNotificationText: "#000000", csProgressBg: "#5c2535", csProgressFg: "#e879a0", csVolumeBg: "#5c2535", csVolumeFg: "#e879a0",
      },
    },
    forest: {
      name: "Forest", emoji: "🌿", builtin: true,
      colors: {
        csText: "#f0fdf4", csSubtext: "#86efac",
        csMain: "#071a0e", csMainElevated: "#0d2615",
        csHighlight: "#163620", csHighlightElevated: "#1e4d2c",
        csAccent: "#22c55e", csPlayButton: "#22c55e", csPlayButtonHover: "#4ade80",
        csButtonDisabled: "#1a3320", csSidebar: "#040f08",
        csPlayer: "#071a0e", csCard: "#0e2117", csCardHover: "#1a3825",
        csNotification: "#22c55e", csNotificationText: "#000000", csProgressBg: "#1e4d2c", csProgressFg: "#22c55e", csVolumeBg: "#1e4d2c", csVolumeFg: "#22c55e",
      },
    },
    cyber: {
      name: "Cyberpunk", emoji: "⚡", builtin: true,
      colors: {
        csText: "#f0f9ff", csSubtext: "#67e8f9",
        csMain: "#050a10", csMainElevated: "#080f18",
        csHighlight: "#0d1a24", csHighlightElevated: "#102030",
        csAccent: "#06b6d4", csPlayButton: "#06b6d4", csPlayButtonHover: "#22d3ee",
        csButtonDisabled: "#0e3040", csSidebar: "#030609",
        csPlayer: "#050a10", csCard: "#091420", csCardHover: "#0e2030",
        csNotification: "#f59e0b", csNotificationText: "#000000", csProgressBg: "#102030", csProgressFg: "#06b6d4", csVolumeBg: "#102030", csVolumeFg: "#f59e0b",
      },
    },
    monochrome: {
      name: "Monochrome", emoji: "⬜", builtin: true,
      colors: {
        csText: "#ffffff", csSubtext: "#bbbbbb",
        csMain: "#0d0d0d", csMainElevated: "#141414",
        csHighlight: "#1f1f1f", csHighlightElevated: "#333333",
        csAccent: "#ffffff", csPlayButton: "#ffffff", csPlayButtonHover: "#dddddd",
        csButtonDisabled: "#555555", csSidebar: "#000000",
        csPlayer: "#0d0d0d", csCard: "#161616", csCardHover: "#2a2a2a",
        csNotification: "#ffffff", csNotificationText: "#000000", csProgressBg: "#333333", csProgressFg: "#ffffff", csVolumeBg: "#333333", csVolumeFg: "#bbbbbb",
      },
    },
    light: {
      name: "Light Mode", emoji: "☀️", builtin: true,
      colors: {
        csText: "#000000", csSubtext: "#6a6a6a",
        csMain: "#ffffff", csMainElevated: "#f0f0f0",
        csHighlight: "#e0e0e0", csHighlightElevated: "#cccccc",
        csAccent: "#1db954", csPlayButton: "#1db954", csPlayButtonHover: "#1ed760",
        csButtonDisabled: "#aaaaaa", csSidebar: "#f5f5f5",
        csPlayer: "#ffffff", csCard: "#f8f8f8", csCardHover: "#ebebeb",
        csNotification: "#3d91f4", csNotificationText: "#000000", csProgressBg: "#cccccc", csProgressFg: "#1db954", csVolumeBg: "#cccccc", csVolumeFg: "#1db954",
      },
    },
  };

  const COLOR_DEFS = [
    { key: "csText",              labelKey: "csText",              group: "groupText" },
    { key: "csSubtext",           labelKey: "csSubtext",           group: "groupText" },
    { key: "csMain",              labelKey: "csMain",              group: "groupBg" },
    { key: "csMainElevated",      labelKey: "csMainElevated",      group: "groupBg" },
    { key: "csHighlight",         labelKey: "csHighlight",         group: "groupBg" },
    { key: "csHighlightElevated", labelKey: "csHighlightElevated", group: "groupBg" },
    { key: "csAccent",            labelKey: "csAccent",            group: "groupAccents" },
    { key: "csPlayButton",        labelKey: "csPlayButton",        group: "groupAccents" },
    { key: "csPlayButtonHover",   labelKey: "csPlayButtonHover",   group: "groupAccents" },
    { key: "csButtonDisabled",    labelKey: "csButtonDisabled",    group: "groupAccents" },
    { key: "csSidebar",           labelKey: "csSidebar",           group: "groupStructure" },
    { key: "csPlayer",            labelKey: "csPlayer",            group: "groupStructure" },
    { key: "csCard",              labelKey: "csCard",              group: "groupStructure" },
    { key: "csCardHover",         labelKey: "csCardHover",         group: "groupStructure" },
    { key: "csNotification",      labelKey: "csNotification",      group: "groupStructure" },
    { key: "csNotificationText",  labelKey: "csNotificationText",  group: "groupStructure" },
    { key: "csProgressBg",        labelKey: "csProgressBg",        group: "groupPlayer" },
    { key: "csProgressFg",        labelKey: "csProgressFg",        group: "groupPlayer" },
    { key: "csVolumeBg",          labelKey: "csVolumeBg",          group: "groupPlayer" },
    { key: "csVolumeFg",          labelKey: "csVolumeFg",          group: "groupPlayer" },
  ];


