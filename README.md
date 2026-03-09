# 🎨 ChromaShift

> Customize every Spotify color from the Settings page — in real time.

ChromaShift is a [Spicetify](https://spicetify.app/) extension that lets you change Spotify's colors without touching any theme files. Everything is done through a clean interface injected right into **Settings**.

---

## ✨ Features

| Feature | Description |
|---|---|
| **7 Presets** | Spotify Default, Midnight Blue, Rose Gold, Forest, Cyberpunk, Monochrome, Light Mode |
| **13 color variables** | Text, subtext, backgrounds, highlights, accent, buttons, sidebar, player, cards, notifications |
| **Live preview** | Colors update instantly as you move the picker |
| **Full override** | Overrides both legacy `--spice-*` and modern `--encore-*` Spotify tokens |
| **Persistent** | Colors are saved via `Spicetify.LocalStorage` and applied on every launch |
| **Export / Import** | Share your theme as a `.json` file |

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
- **Main text** — track titles, primary labels
- **Subtext** — artist names, metadata, captions

### Backgrounds
- **Main background** — central content area
- **Elevated background** — panels and raised surfaces
- **Hover / selection** — row hover in lists
- **Elevated hover** — hover on raised surfaces

### Accent & Buttons
- **Accent color** — progress bar, active links, indicators
- **Primary button** — play, shuffle, follow
- **Disabled button** — unavailable actions

### Structure
- **Sidebar** — left navigation bar
- **Player bar** — bottom playback bar
- **Cards** — album, playlist, artist cards
- **Notifications** — toasts and badges

---

## 🔧 How to use

1. Scroll to the **ChromaShift** section at the bottom
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

PRs welcome! If you've created a great color scheme, open a PR to add it as an official preset.


![Version](https://img.shields.io/github/v/release/stefaceriani/chromashift?logo=github)
![Downloads](https://img.shields.io/github/downloads/stefaceriani/chromashift/total?logo=github)
![Stars](https://img.shields.io/github/stars/stefaceriani/chromashift?style=social)
![Forks](https://img.shields.io/github/forks/stefaceriani/chromashift?style=social)
![License](https://img.shields.io/github/license/stefaceriani/chromashift)
![Last Commit](https://img.shields.io/github/last-commit/stefaceriani/chromashift)
![Repo Size](https://img.shields.io/github/repo-size/stefaceriani/chromashift)
![Issues](https://img.shields.io/github/issues/stefaceriani/chromashift)
![Pull Requests](https://img.shields.io/github/issues-pr/stefaceriani/chromashift)
![Spotify](https://img.shields.io/badge/Spotify-Compatible-1DB954?logo=spotify&logoColor=white)
![Spicetify](https://img.shields.io/badge/Spicetify-Extension-FF5C00?logo=spotify&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-blue)
[![Report Bug](https://img.shields.io/badge/Report-Bug-red?logo=github)](https://github.com/stefaceriani/chromashift/issues)
[![Request Feature](https://img.shields.io/badge/Request-Feature-blue?logo=github)](https://github.com/stefaceriani/chromashift/issues)
[![Star Repo](https://img.shields.io/badge/Star-this%20repo-yellow?logo=github)](https://github.com/stefaceriani/chromashift)
