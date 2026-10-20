# Installs the `chr` command (Windows).
#   irm https://raw.githubusercontent.com/stefaceriani/chromashift/cli/install.ps1 | iex
$ErrorActionPreference = "Stop"
$repo = "stefaceriani/chromashift"
$arch = if ($env:PROCESSOR_ARCHITECTURE -eq "ARM64") { "arm64" } else { "amd64" }

$rel = (Invoke-RestMethod "https://api.github.com/repos/$repo/releases") |
  Where-Object { $_.tag_name -like "cli-v*" } | Select-Object -First 1
if (-not $rel) { throw "No CLI release found on $repo" }
$asset = $rel.assets | Where-Object { $_.name -eq "chr-windows-$arch.exe" } | Select-Object -First 1
if (-not $asset) { throw "No binary for windows-$arch in $($rel.tag_name)" }

$dir = Join-Path $env:LOCALAPPDATA "chromashift\bin"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Invoke-WebRequest $asset.browser_download_url -OutFile (Join-Path $dir "chr.exe")

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if (($userPath -split ";") -notcontains $dir) {
  [Environment]::SetEnvironmentVariable("Path", "$userPath;$dir", "User")
  Write-Host "Added $dir to your PATH - open a new terminal."
}
Write-Host "chr $($rel.tag_name) installed. Try: chr -h"
