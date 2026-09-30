  // ===========================================================
  // CLOUD SYNC
  // ===========================================================

  const KEY_CLOUD_EMAIL = "cs4_cloud_email";
  const KEY_CLOUD_HASH  = "cs4_cloud_hash";
  const CLOUD_URL = "https://lqnhivdkxjwfadddmgne.supabase.co";
  const CLOUD_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbmhpdmRreGp3ZmFkZGRtZ25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNjAxMDcsImV4cCI6MjA4OTkzNjEwN30.v9Fab6I7ydYosz80GIqMxjE889B6wRCGNBa-ArtB3aA";

  function csHash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    return h.toString(16);
  }

  function cloudGetCreds() {
    const email = Spicetify.LocalStorage.get(KEY_CLOUD_EMAIL);
    const hash  = Spicetify.LocalStorage.get(KEY_CLOUD_HASH);
    return (email && hash) ? { email, hash } : null;
  }

  function cloudSaveCreds(email, pwHash) {
    Spicetify.LocalStorage.set(KEY_CLOUD_EMAIL, email);
    Spicetify.LocalStorage.set(KEY_CLOUD_HASH, pwHash);
  }

  function cloudClearCreds() {
    Spicetify.LocalStorage.remove(KEY_CLOUD_EMAIL);
    Spicetify.LocalStorage.remove(KEY_CLOUD_HASH);
  }

  async function cloudFetch(table, method, body, params) {
    const res = await fetch(CLOUD_URL + "/rest/v1/" + table + (params || ""), {
      method: method || "GET",
      headers: {
        "apikey": CLOUD_KEY,
        "Authorization": "Bearer " + CLOUD_KEY,
        "Content-Type": "application/json",
        "Prefer": method === "POST" ? "resolution=merge-duplicates,return=representation" : "",
      },
      body: body ? JSON.stringify(body) : null,
    });
    if (method === "DELETE" || (method === "PATCH" && res.status === 204)) return { ok: true };
    const data = await res.json();
    if (!res.ok) return { ok: false, error: (data && data.message) || "Server error." };
    return { ok: true, data };
  }

  async function cloudLogin(email, password) {
    email = email.toLowerCase().trim();
    const res = await cloudFetch("cs_users", "GET", null,
      "?email=eq." + encodeURIComponent(email) + "&select=email,password_hash");
    if (!res.ok || !res.data || res.data.length === 0) return { ok: false, error: "No account found." };
    if (res.data[0].password_hash !== csHash(password)) return { ok: false, error: "Wrong password." };
    cloudSaveCreds(email, csHash(password));
    return { ok: true };
  }

  async function cloudPush() {
    const creds = cloudGetCreds();
    if (!creds) return { ok: false, error: "Not connected." };
    const customs = loadCustomPresets();
    const entries = Object.entries(customs);
    if (entries.length === 0) return { ok: false, error: "No custom presets to push." };
    let pushed = 0;
    for (const [key, preset] of entries) {
      const r = await cloudFetch("cs_presets", "POST", {
        user_email: creds.email,
        preset_key: key,
        name: preset.name,
        emoji: preset.emoji || "🎨",
        colors: preset.colors,
        updated_at: Date.now(),
      });
      if (r.ok) pushed++;
    }
    return { ok: true, count: pushed, total: entries.length };
  }

  async function cloudPull() {
    const creds = cloudGetCreds();
    if (!creds) return { ok: false, error: "Not connected." };
    const res = await cloudFetch("cs_presets", "GET", null,
      "?user_email=eq." + encodeURIComponent(creds.email) + "&select=*&order=updated_at.desc");
    if (!res.ok || !res.data) return { ok: false, error: "Failed to fetch presets." };
    if (res.data.length === 0) return { ok: false, error: "No cloud presets found." };
    const customs = loadCustomPresets();
    for (const p of res.data) {
      customs[p.preset_key] = { name: p.name, emoji: p.emoji || "🎨", builtin: false, colors: p.colors };
    }
    saveCustomPresets(customs);
    return { ok: true, count: res.data.length };
  }



