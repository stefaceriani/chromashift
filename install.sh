#!/usr/bin/env sh
# Installs the `chr` command (macOS / Linux).
#   curl -fsSL https://raw.githubusercontent.com/stefaceriani/chromashift/cli/install.sh | sh
set -eu
repo="stefaceriani/chromashift"
os=$(uname -s | tr '[:upper:]' '[:lower:]')
case "$(uname -m)" in
  x86_64|amd64) arch=amd64 ;;
  arm64|aarch64) arch=arm64 ;;
  *) echo "unsupported architecture: $(uname -m)" >&2; exit 1 ;;
esac

url=$(curl -fsSL "https://api.github.com/repos/$repo/releases" \
  | grep -o "\"browser_download_url\": *\"[^\"]*/cli-v[^\"]*/chr-$os-$arch\"" \
  | head -n 1 | sed 's/.*"\(https[^"]*\)"/\1/')
[ -n "$url" ] || { echo "no CLI binary found for $os-$arch" >&2; exit 1; }

dir="$HOME/.local/bin"
mkdir -p "$dir"
curl -fsSL "$url" -o "$dir/chr"
chmod +x "$dir/chr"
echo "chr installed in $dir"
case ":$PATH:" in *":$dir:"*) ;; *) echo "add $dir to your PATH" ;; esac
