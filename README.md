# 🎨 ChromaShift

> Customize every Spotify color from the Settings page — in real time.

ChromaShift is a [Spicetify](https://spicetify.app/) extension that lets you change Spotify's colors without touching any theme files. Everything is done through a clean interface injected right into **Settings**.

<a href="preview.png"><img src="preview.png" height="600"></a>

---

## ✨ Features

| Feature | Description |
|---|---|
| **7 Presets** | Spotify Default, Midnight Blue, Rose Gold, Forest, Cyberpunk, Monochrome, Light Mode |
| **13+ color variables** | Text, subtext, backgrounds, highlights, accent, buttons, sidebar, player, cards, notifications |
| **Live preview** | Colors update instantly as you move the picker |
| **Full override** | Overrides both legacy `--spice-*` and modern `--encore-*` Spotify tokens |
| **Persistent** | Colors are saved via `Spicetify.LocalStorage` and applied on every launch |
| **Export / Import** | Share your theme as a `.json` file |
| **AutoUpdater CHecker** | Extension auto check new updates |

---

## 📦 Installation

### Via Spicetify Marketplace (recommended)
1. Open Spotify with Spicetify installed
2. Click the **Marketplace** icon in the top bar
3. Search for **ChromaShift**
4. Click **Install**

### Manual
```bash
# macOS / Linux
cp chromashift.js ~/.config/spicetify/Extensions/
spicetify config extensions chromashift.js
spicetify apply

# Windows (PowerShell)
cp chromashift.js "$env:APPDATA\spicetify\Extensions\"
spicetify config extensions chromashift.js
spicetify apply
```

---

## 🎨 Customizable colors

### Text
- **Main text**
- **Subtext**

### Backgrounds
- **Main background**
- **Elevated background**
- **Hover / selection**
- **Elevated hover**

### Accent & Buttons
- **Accent color**
- **Primary button**
- **Disabled button**

### Structure
- **Sidebar**
- **Player bar**
- **Cards**
- **Notifications**

### & more

---

## 🔧 How to use

1. Scroll to the **ChromaShift** section at settings page
2. Pick a **preset** or click any color circle to open the picker
3. Colors update **live** as you drag the picker
4. Click **Save & Apply** to persist your changes

---

## 📤 Export / Import themes

- **Export**: click "Esporta tema" — JSON is copied to your clipboard
- **Import**: click "Importa tema" — select any `.json` file exported previously

---

## 🛠 Technical notes

ChromaShift overrides:
- All `--spice-*` CSS variables (Spicetify legacy theming layer)
- All `--encore-base-color-*` tokens (Spotify's Encore design system base)
- All `--encore-color-*` semantic tokens
- Specific hardcoded element selectors where Spotify ignores CSS variables

This ensures changes apply to every visible element in the UI.

---

## 🤝 Contributing

PRs welcome! If you've created a great color scheme, open a PR to add it as an official preset and if you want your name will be added to the preset list.

## 🐛 Bug or Request?

Open a issue

# 📷 Screenshot
<table>
  <tr>
    <td><img src="Preset - 1.png" width="600"/></td>
    <td><img src="Preset - 2.png" width="600"/></td>
    <td><img src="Preset - 3.png" width="600"/></td>
    <td><img src="Preset - 4.png" width="600"/></td>
  </tr>
</table>

<table>
  <tr>
    <td><img src="Preset - 5.png" width="600"/></td>
    <td><img src="Preset - 6.png" width="600"/></td>
    <td><img src="Preset - 7.png" width="600"/></td>
    <td><img src="Custom.png" width="600"/></td>
  </tr>
</table>

---
[![Version](https://img.shields.io/github/v/release/stefaceriani/chromashift?logo=github)](https://github.com/stefaceriani/chromashift/releases)
[![Forks](https://img.shields.io/github/forks/stefaceriani/chromashift?style=social)](https://github.com/stefaceriani/chromashift/fork)
[![Last Commit](https://img.shields.io/github/last-commit/stefaceriani/chromashift)](https://github.com/stefaceriani/chromashift/commit/)
[![Issues](https://img.shields.io/github/issues/stefaceriani/chromashift)](https://github.com/stefaceriani/chromashift/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/stefaceriani/chromashift)](https://github.com/stefaceriani/chromashift/pulls)
[![Spotify](https://img.shields.io/badge/Spotify-Compatible-1DB954?logo=spotify&logoColor=white)](https://open.spotify.com)
[![Spicetify](https://img.shields.io/badge/Spicetify-Extension-FF5C00?logo=spotify&logoColor=white)](https://spicetify.app)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-blue)](https://spicetify.app/docs/)
[![Report Bug](https://img.shields.io/badge/Report-Bug-red?logo=github)](https://github.com/stefaceriani/chromashift/issues)
[![Request Feature](https://img.shields.io/badge/Request-Feature-blue?logo=github)](https://github.com/stefaceriani/chromashift/issues)
