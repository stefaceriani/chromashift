# chr — ChromaShift CLI

Command line for [ChromaShift](https://github.com/stefaceriani/chromashift). It downloads feature
**modules** from this branch (`cli`), installs them as Spicetify extensions and remembers their settings.

## Install

Windows (PowerShell):
```powershell
irm https://raw.githubusercontent.com/stefaceriani/chromashift/cli/install.ps1 | iex
```
macOS / Linux:
```sh
curl -fsSL https://raw.githubusercontent.com/stefaceriani/chromashift/cli/install.sh | sh
```
Or build it yourself: `go build -o chr .`

Needs [Spicetify](https://spicetify.app) in your `PATH`.

## Commands

```
chr list                       modules available on this branch
chr install <module>           download + enable
chr remove  <module>           disable (settings are kept)
chr update  [module]           re-download installed modules

chr set <module> <key> <value> change a module setting (installs the module if needed)
chr get [module]               print saved settings

chr font <name>                apply a Google Fonts font to every text   [beta]
chr font search <text>         search the Google Fonts catalogue
chr font show | reset

chr apply                      spicetify apply
chr enable-devtools            spicetify enable-devtools
chr doctor                     check spicetify, folders, network
chr -h | -v
```
Flags: `--no-apply` (don't run `spicetify apply`), `--force` (font: skip the Google Fonts check).

Every change that touches the extension needs `spicetify apply` (Spotify restarts); `chr` runs it for you.

## How it works

```
modules/index.json   list of modules (id, file, version, description, beta)
modules/<id>.js      the module code
```
`chr install font` downloads `modules/font.js`, wraps it as
`(function (CHR_CONFIG) { ... })({ ...saved settings... })`, writes it to
`<spicetify userdata>/Extensions/chromashift-font.js` and registers it with
`spicetify config extensions`. Settings live in `%APPDATA%\chromashift\config.json`
(`~/.config/chromashift/config.json` on Linux).

## Adding a new function

1. Create `modules/<id>.js`. Read its settings from `CHR_CONFIG.<key>`.
2. Add an entry to `modules/index.json`. Bump `version` when you change the file.
3. Push to the `cli` branch. No new binary needed: `chr install <id>`, `chr set <id> <key> <value>`, `chr update`.

## Releasing the binary

Push a tag `cli-vX.Y.Z`; `.github/workflows/release.yml` builds Windows/Linux/macOS binaries and
attaches them to a **pre-release** (so the extension's auto-updater, which reads `releases/latest`, ignores it).

## Testing without GitHub

```sh
python3 -m http.server 8765           # in this folder
CHR_BASE=http://127.0.0.1:8765 CHR_HOME=/tmp/chr CHR_EXT_DIR=/tmp/ext chr font "Inter" --force --no-apply
```
