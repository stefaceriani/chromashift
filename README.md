# 🎨 ChromaShift - v3.2.0 

> Customize every Spotify color from the Settings page — in real time.

### ChromaShift is a [Spicetify](https://spicetify.app/) extension that lets you change Spotify's colors without touching any theme files. Everything is done through a clean interface injected right into **Settings**.
---
If Chromashift doesn't work first check our [status page](https://status.chromashift.qzz.io) or [site](https://chromashift.qzz.io)

## ✨ Features

| Feature | Description |
|---|---|
| **7 Presets** | Spotify Default, Midnight Blue, Rose Gold, Forest, Cyberpunk, Monochrome, Light Mode |
| **13+ color variables** | Text, subtext, backgrounds, highlights, accent, buttons, sidebar, player, cards, notifications |
| **Live preview** | Colors update instantly as you move the picker |
| **Full override** | Overrides both legacy `--spice-*` and modern `--encore-*` Spotify tokens |
| **Persistent** | Colors are saved via `Spicetify.LocalStorage` and applied on every launch |
| **Export / Import** | Share your theme as a `.json` file |
| **AutoUpdater Checker** | Extension auto check new updates and notify you |
| **Language Traslator** | Available language: 🇬🇧 / 🇺🇸 / 🇮🇹 / 🇩🇪 / 🇫🇷 / 🇪🇸 / 🇷🇺 / 🇨🇳
| **Online Cloud** | https://chromashift.qzz.io (only after login/register) |

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

#### & more

---

## 🔧 How to use

1. Scroll to the **ChromaShift** section at settings page
2. Pick a **preset** or click any color circle to open the picker
3. Colors update **live** as you drag the picker
4. Click **Save & Apply** to persist your changes

---

## 📤 Cloud Import / Export presets

Login to [https://chromashift.qzz.io/](https://chromashift.qzz.io/)
Authorise Cloude integration in "Cloud" section

- **Export**: click "Push to cloud" — Presets not yet on the cloud will be added.
- **Import**: click "Pull from cloud" — Presets saved in the cloud that are not already present locally will be added to spotify.

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

Thanks for contributing ❤️; if you want to know how, read this 👉 [CONTRIBUTING.md](CONTRIBUTING.md)

## 🐛 Bug or Request?

- Issue: [github.com/stafaceriani/chromashift/issues](https://github.com/stefaceriani/chromashift/issues)
- Discord: [.gg/pVZHxKW5KN](https://discord.gg/pVZHxKW5KN)
- Website: [https://chromashift.qzz.io/](https://chromashift.qzz.io/contacts)

---
[![Version](https://img.shields.io/github/v/release/stefaceriani/chromashift?logo=github)](https://github.com/stefaceriani/chromashift/releases) [![Forks](https://img.shields.io/github/forks/stefaceriani/chromashift?style=social)](https://github.com/stefaceriani/chromashift/fork) [![Issues](https://img.shields.io/github/issues/stefaceriani/chromashift)](https://github.com/stefaceriani/chromashift/issues)
