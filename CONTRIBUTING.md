# Contributing to ChromaShift

Thanks for your interest in contributing to ChromaShift! 🎨 Whether you want to report a bug, suggest a feature, or add a new preset, this guide will help you get started.

## 🐛 Reporting a bug or preset issue

Before opening an issue:

1. Check the [status page](https://status.chromashift.qzz.io) to rule out known/temporary issues
2. Search [existing issues](https://github.com/stefaceriani/chromashift/issues) to avoid duplicates

Then open a new issue using the right template, which will guide you through the fields to fill in:

- **🐞 Bug Report** — for issues with the extension in general
- **⚙️ Presets/Community Issue** — for issues with a built-in or community preset

## 💡 Suggesting a feature

Open a new issue and pick the **✨ Feature Request** template, which will guide you through the fields to fill in.

## 🎨 Adding a preset

One of the easiest ways to contribute! To propose a new official preset:

1. Fork the repo
2. Create your preset (you can start by exporting your ChromaShift settings as `.json`)
3. Add it to the `custom_preset/` folder
4. Open a Pull Request describing the preset's theme/mood

If the preset is accepted, your name will be added to the contributors list in the README.

## 🔧 Contributing code

1. Fork the repo and create a dedicated branch (`git checkout -b fix/bug-name` or `feature/feature-name`)
2. Test your changes locally by linking `chromashift.js` to your Spicetify Extensions folder:
   ```bash
   cp chromashift.js ~/.config/spicetify/Extensions/
   spicetify config extensions chromashift.js
   spicetify apply
   ```
3. Make sure your changes don't break:
   - The `--spice-*` and `--encore-*` variable overrides
   - Saving/loading via `Spicetify.LocalStorage`
   - Preset export/import in `.json`
4. If you add user-facing text, update it in all supported languages (🇬🇧 🇮🇹 🇩🇪 🇫🇷 🇪🇸 🇷🇺 🇨🇳) or clearly flag which ones are missing
5. Open a Pull Request describing what changes and why

## 📐 Code style

- Keep the style already used in `chromashift.js` (indentation, variable naming)
- Comment non-obvious parts, especially hardcoded CSS selectors for elements Spotify doesn't expose as variables
- Avoid unnecessary external dependencies: the extension aims to stay lightweight

## ✅ Pull Request checklist

Before opening the PR, make sure you've:

- [ ] Tested the changes on Spotify with an up-to-date Spicetify
- [ ] Checked that existing presets still work
- [ ] Updated the README if the change affects visible behavior
- [ ] Written a clear title and description for the PR

## 💬 Questions?

If you have questions before even getting started, the fastest way to ask is on [Discord](https://discord.gg/pVZHxKW5KN). Otherwise, feel free to open an issue.
