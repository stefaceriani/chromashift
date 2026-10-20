// chr — command line tool for ChromaShift.
//
// Downloads feature modules from the `cli` branch of stefaceriani/chromashift,
// installs them as Spicetify extensions and keeps their settings.
//
// Add a new feature without touching this file: put modules/<id>.js in the branch
// and add an entry to modules/index.json, then run `chr install <id>`.
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

const version = "0.1.0"
const defaultBase = "https://raw.githubusercontent.com/stefaceriani/chromashift/cli"

// ---------------------------------------------------------------- types

type module struct {
	ID          string `json:"id"`
	File        string `json:"file"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Version     string `json:"version"`
	Beta        bool   `json:"beta"`
}

type state struct {
	Installed map[string]string            `json:"installed"` // module id -> installed version
	Settings  map[string]map[string]string `json:"settings"`  // module id -> key -> value
}

// ---------------------------------------------------------------- paths / state

func baseURL() string {
	if b := os.Getenv("CHR_BASE"); b != "" {
		return strings.TrimRight(b, "/")
	}
	return defaultBase
}

func homeDir() string {
	if h := os.Getenv("CHR_HOME"); h != "" {
		return h
	}
	d, err := os.UserConfigDir()
	if err != nil {
		d = "."
	}
	return filepath.Join(d, "chromashift")
}

func statePath() string { return filepath.Join(homeDir(), "config.json") }
func cachePath(id string) string {
	return filepath.Join(homeDir(), "modules", id+".js")
}
func extFileName(id string) string { return "chromashift-" + id + ".js" }

func loadState() *state {
	st := &state{Installed: map[string]string{}, Settings: map[string]map[string]string{}}
	if b, err := os.ReadFile(statePath()); err == nil {
		_ = json.Unmarshal(b, st)
	}
	if st.Installed == nil {
		st.Installed = map[string]string{}
	}
	if st.Settings == nil {
		st.Settings = map[string]map[string]string{}
	}
	return st
}

func (s *state) save() error {
	if err := os.MkdirAll(homeDir(), 0o755); err != nil {
		return err
	}
	b, _ := json.MarshalIndent(s, "", "  ")
	return os.WriteFile(statePath(), b, 0o644)
}

// ---------------------------------------------------------------- network

var client = &http.Client{Timeout: 15 * time.Second}

func httpGet(u string) ([]byte, int, error) {
	req, err := http.NewRequest("GET", u, nil)
	if err != nil {
		return nil, 0, err
	}
	req.Header.Set("User-Agent", "chr-cli/"+version)
	res, err := client.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer res.Body.Close()
	b, err := io.ReadAll(res.Body)
	return b, res.StatusCode, err
}

func fetchBranchFile(path string) ([]byte, error) {
	u := baseURL() + "/" + path + "?t=" + fmt.Sprint(time.Now().Unix())
	b, code, err := httpGet(u)
	if err != nil {
		return nil, fmt.Errorf("cannot reach %s (%v)", u, err)
	}
	if code != 200 {
		return nil, fmt.Errorf("%s answered HTTP %d", u, code)
	}
	return b, nil
}

func fetchIndex() ([]module, error) {
	b, err := fetchBranchFile("modules/index.json")
	if err != nil {
		return nil, err
	}
	var mods []module
	if err := json.Unmarshal(b, &mods); err != nil {
		return nil, fmt.Errorf("modules/index.json is not valid JSON: %v", err)
	}
	return mods, nil
}

func findModule(id string) (*module, error) {
	mods, err := fetchIndex()
	if err != nil {
		return nil, err
	}
	for i := range mods {
		if strings.EqualFold(mods[i].ID, id) {
			return &mods[i], nil
		}
	}
	return nil, fmt.Errorf("unknown module %q (see: chr list)", id)
}

// ---------------------------------------------------------------- spicetify

func spicetifyPath() (string, bool) {
	p, err := exec.LookPath("spicetify")
	return p, err == nil
}

func runSpicetify(args ...string) error {
	p, ok := spicetifyPath()
	if !ok {
		return fmt.Errorf("spicetify not found in PATH")
	}
	cmd := exec.Command(p, args...)
	cmd.Stdout, cmd.Stderr, cmd.Stdin = os.Stdout, os.Stderr, os.Stdin
	return cmd.Run()
}

func extDir() (string, error) {
	if d := os.Getenv("CHR_EXT_DIR"); d != "" {
		return d, os.MkdirAll(d, 0o755)
	}
	p, ok := spicetifyPath()
	if !ok {
		return "", fmt.Errorf("spicetify not found in PATH - install it first: https://spicetify.app")
	}
	out, err := exec.Command(p, "path", "userdata").Output()
	if err != nil {
		return "", fmt.Errorf("`spicetify path userdata` failed: %v", err)
	}
	d := filepath.Join(strings.TrimSpace(string(out)), "Extensions")
	return d, os.MkdirAll(d, 0o755)
}

func applyChanges(noApply bool) {
	if noApply {
		fmt.Println("skipped `spicetify apply` (run it yourself: spicetify apply)")
		return
	}
	if _, ok := spicetifyPath(); !ok {
		fmt.Println("spicetify not found - run `spicetify apply` yourself")
		return
	}
	fmt.Println("running spicetify apply ...")
	if err := runSpicetify("apply"); err != nil {
		fmt.Println("spicetify apply failed:", err)
	}
}

// ---------------------------------------------------------------- modules

// writeExtension wraps the cached module source with its current settings
// and writes it into the Spicetify Extensions folder.
func writeExtension(st *state, id string, ver string) error {
	src, err := os.ReadFile(cachePath(id))
	if err != nil {
		return fmt.Errorf("module %q is not downloaded (run: chr install %s)", id, id)
	}
	dir, err := extDir()
	if err != nil {
		return err
	}
	cfg := st.Settings[id]
	if cfg == nil {
		cfg = map[string]string{}
	}
	cfgJSON, _ := json.Marshal(cfg)
	var sb strings.Builder
	fmt.Fprintf(&sb, "// Generated by chr %s - module %s %s. Do not edit: run `chr` instead.\n", version, id, ver)
	sb.WriteString("(function (CHR_CONFIG) {\n\"use strict\";\n")
	sb.Write(src)
	fmt.Fprintf(&sb, "\n})(%s);\n", cfgJSON)
	return os.WriteFile(filepath.Join(dir, extFileName(id)), []byte(sb.String()), 0o644)
}

func download(m *module) error {
	b, err := fetchBranchFile("modules/" + m.File)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(cachePath(m.ID)), 0o755); err != nil {
		return err
	}
	return os.WriteFile(cachePath(m.ID), b, 0o644)
}

func installModule(st *state, id string) (*module, error) {
	m, err := findModule(id)
	if err != nil {
		return nil, err
	}
	if err := download(m); err != nil {
		return nil, err
	}
	if err := writeExtension(st, m.ID, m.Version); err != nil {
		return nil, err
	}
	if _, ok := spicetifyPath(); ok {
		if err := runSpicetify("config", "extensions", extFileName(m.ID)); err != nil {
			return nil, fmt.Errorf("spicetify config failed: %v", err)
		}
	}
	st.Installed[m.ID] = m.Version
	return m, st.save()
}

func regenerate(st *state, id string) error {
	return writeExtension(st, id, st.Installed[id])
}

// ---------------------------------------------------------------- commands

func cmdList() error {
	mods, err := fetchIndex()
	if err != nil {
		return err
	}
	st := loadState()
	sort.Slice(mods, func(i, j int) bool { return mods[i].ID < mods[j].ID })
	fmt.Printf("%-12s %-9s %s\n", "MODULE", "STATUS", "DESCRIPTION")
	for _, m := range mods {
		status := "-"
		if v, ok := st.Installed[m.ID]; ok {
			status = "v" + v
			if v != m.Version {
				status += "*"
			}
		}
		tag := ""
		if m.Beta {
			tag = " [beta]"
		}
		fmt.Printf("%-12s %-9s %s%s\n", m.ID, status, m.Description, tag)
	}
	fmt.Println("\n* = update available (chr update)")
	return nil
}

func cmdInstall(ids []string, noApply bool) error {
	if len(ids) == 0 {
		return fmt.Errorf("usage: chr install <module>...")
	}
	st := loadState()
	for _, id := range ids {
		m, err := installModule(st, id)
		if err != nil {
			return err
		}
		fmt.Printf("installed %s v%s\n", m.ID, m.Version)
	}
	applyChanges(noApply)
	return nil
}

func cmdRemove(ids []string, noApply bool) error {
	if len(ids) == 0 {
		return fmt.Errorf("usage: chr remove <module>...")
	}
	st := loadState()
	for _, id := range ids {
		if _, ok := st.Installed[id]; !ok {
			return fmt.Errorf("module %q is not installed", id)
		}
		if _, ok := spicetifyPath(); ok {
			_ = runSpicetify("config", "extensions", extFileName(id)+"-")
		}
		if dir, err := extDir(); err == nil {
			_ = os.Remove(filepath.Join(dir, extFileName(id)))
		}
		delete(st.Installed, id)
		fmt.Println("removed", id, "(settings kept)")
	}
	if err := st.save(); err != nil {
		return err
	}
	applyChanges(noApply)
	return nil
}

func cmdUpdate(ids []string, noApply bool) error {
	st := loadState()
	if len(ids) == 0 {
		for id := range st.Installed {
			ids = append(ids, id)
		}
	}
	if len(ids) == 0 {
		fmt.Println("nothing installed")
		return nil
	}
	for _, id := range ids {
		if _, ok := st.Installed[id]; !ok {
			return fmt.Errorf("module %q is not installed", id)
		}
		m, err := installModule(st, id)
		if err != nil {
			return err
		}
		fmt.Printf("updated %s -> v%s\n", m.ID, m.Version)
	}
	applyChanges(noApply)
	return nil
}

func cmdSet(args []string, noApply bool) error {
	if len(args) < 3 {
		return fmt.Errorf("usage: chr set <module> <key> <value>")
	}
	id, key, val := args[0], args[1], strings.Join(args[2:], " ")
	return setSetting(id, key, val, noApply)
}

func setSetting(id, key, val string, noApply bool) error {
	st := loadState()
	if st.Settings[id] == nil {
		st.Settings[id] = map[string]string{}
	}
	if val == "" {
		delete(st.Settings[id], key)
	} else {
		st.Settings[id][key] = val
	}
	if _, ok := st.Installed[id]; !ok {
		if _, err := installModule(st, id); err != nil {
			return err
		}
		fmt.Println("installed", id)
	} else if err := regenerate(st, id); err != nil {
		return err
	}
	if err := st.save(); err != nil {
		return err
	}
	applyChanges(noApply)
	return nil
}

func cmdGet(args []string) error {
	st := loadState()
	ids := args
	if len(ids) == 0 {
		for id := range st.Settings {
			ids = append(ids, id)
		}
		sort.Strings(ids)
	}
	if len(ids) == 0 {
		fmt.Println("no settings saved")
		return nil
	}
	for _, id := range ids {
		keys := []string{}
		for k := range st.Settings[id] {
			keys = append(keys, k)
		}
		sort.Strings(keys)
		for _, k := range keys {
			fmt.Printf("%s.%s = %s\n", id, k, st.Settings[id][k])
		}
	}
	return nil
}

// ---- font

func fontList() []string {
	b, code, err := httpGet("https://fonts.google.com/metadata/fonts")
	if err != nil || code != 200 {
		return nil
	}
	s := strings.TrimSpace(string(b))
	s = strings.TrimPrefix(s, ")]}'")
	var data struct {
		List []struct {
			Family     string  `json:"family"`
			Popularity float64 `json:"popularity"`
		} `json:"familyMetadataList"`
	}
	if json.Unmarshal([]byte(s), &data) != nil {
		return nil
	}
	sort.SliceStable(data.List, func(i, j int) bool { return data.List[i].Popularity < data.List[j].Popularity })
	out := make([]string, 0, len(data.List))
	for _, f := range data.List {
		out = append(out, f.Family)
	}
	return out
}

func fontExists(name string) (bool, error) {
	u := "https://fonts.googleapis.com/css2?family=" + url.QueryEscape(name) // spaces become "+"
	_, code, err := httpGet(u)
	if err != nil {
		return false, err
	}
	return code == 200, nil
}

func cmdFont(args []string, noApply, force bool) error {
	if len(args) == 0 || args[0] == "show" {
		st := loadState()
		if n := st.Settings["font"]["name"]; n != "" {
			fmt.Println("font:", n)
		} else {
			fmt.Println("font: (default Spotify font)")
		}
		return nil
	}
	switch args[0] {
	case "reset", "off":
		return setSetting("font", "name", "", noApply)
	case "search":
		q := strings.ToLower(strings.Join(args[1:], " "))
		list := fontList()
		if list == nil {
			return fmt.Errorf("cannot download the Google Fonts catalogue (offline?) - you can still try: chr font <name>")
		}
		n := 0
		for _, f := range list {
			if q == "" || strings.Contains(strings.ToLower(f), q) {
				fmt.Println(f)
				if n++; n >= 25 {
					break
				}
			}
		}
		if n == 0 {
			fmt.Println("no font matches", q)
		}
		return nil
	}

	name := strings.Join(strings.Fields(strings.Join(args, " ")), " ")
	if list := fontList(); list != nil {
		for _, f := range list {
			if strings.EqualFold(f, name) {
				name = f
				break
			}
		}
	}
	if !force {
		ok, err := fontExists(name)
		if err != nil {
			return fmt.Errorf("cannot check Google Fonts (%v) - use --force to set it anyway", err)
		}
		if !ok {
			return fmt.Errorf("%q not found on Google Fonts (try: chr font search %s)", name, strings.Fields(name)[0])
		}
	}
	if err := setSetting("font", "name", name, noApply); err != nil {
		return err
	}
	fmt.Println("font set to", name)
	return nil
}

// ---- doctor / devtools

func cmdDoctor() error {
	ok := func(c bool) string {
		if c {
			return "ok  "
		}
		return "FAIL"
	}
	p, found := spicetifyPath()
	fmt.Printf("[%s] spicetify in PATH %s\n", ok(found), p)
	if found {
		d, err := extDir()
		fmt.Printf("[%s] extensions folder %s\n", ok(err == nil), d)
	}
	_, err := fetchIndex()
	fmt.Printf("[%s] branch cli reachable (%s)\n", ok(err == nil), baseURL())
	if err != nil {
		fmt.Println("       ", err)
	}
	st := loadState()
	fmt.Printf("[info] config %s, %d module(s) installed\n", statePath(), len(st.Installed))
	return nil
}

func cmdDevtools() error {
	if _, ok := spicetifyPath(); !ok {
		return fmt.Errorf("spicetify not found in PATH")
	}
	return runSpicetify("enable-devtools")
}

// ---------------------------------------------------------------- main

const help = `chr - ChromaShift command line  (v` + version + `)

usage: chr <command> [args] [--no-apply] [--force]

modules
  list                         show modules available on the cli branch
  install <module>...          download + enable a module
  remove  <module>...          disable a module (settings are kept)
  update  [module]...          re-download installed modules

settings
  set <module> <key> <value>   change a module setting (installs the module if needed)
  get [module]                 print saved settings

font  [beta]
  font <name>                  apply a Google Fonts font to every text
  font search <text>           search the Google Fonts catalogue
  font show                    print the current font
  font reset                   back to the Spotify font

tools
  apply                        run spicetify apply
  enable-devtools              run spicetify enable-devtools
  doctor                       check spicetify, folders and network
  -h, --help                   this help
  -v, --version                print version

--no-apply   change files but do not run "spicetify apply"
--force      font: skip the Google Fonts existence check
`

func main() {
	var args []string
	noApply, force := false, false
	for _, a := range os.Args[1:] {
		switch a {
		case "--no-apply":
			noApply = true
		case "--force":
			force = true
		default:
			args = append(args, a)
		}
	}
	if len(args) == 0 {
		fmt.Print(help)
		return
	}
	cmd, rest := args[0], args[1:]
	var err error
	switch cmd {
	case "-h", "--help", "help":
		fmt.Print(help)
	case "-v", "--version", "version":
		fmt.Println("chr", version)
	case "list", "ls":
		err = cmdList()
	case "install", "add":
		err = cmdInstall(rest, noApply)
	case "remove", "rm", "uninstall":
		err = cmdRemove(rest, noApply)
	case "update", "upgrade":
		err = cmdUpdate(rest, noApply)
	case "set":
		err = cmdSet(rest, noApply)
	case "get":
		err = cmdGet(rest)
	case "font":
		err = cmdFont(rest, noApply, force)
	case "apply":
		applyChanges(false)
	case "enable-devtools":
		err = cmdDevtools()
	case "doctor":
		err = cmdDoctor()
	default:
		err = fmt.Errorf("unknown command %q (chr -h)", cmd)
	}
	if err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
}
