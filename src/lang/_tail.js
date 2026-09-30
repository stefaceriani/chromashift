  };

  function getLang() {
    const stored = Spicetify.LocalStorage.get(KEY_LANG);
    return (stored && TRANSLATIONS[stored]) ? stored : "en-GB";
  }

  function setLang(code) {
    Spicetify.LocalStorage.set(KEY_LANG, code);
  }

  function t() {
    return TRANSLATIONS[getLang()] || TRANSLATIONS["en-GB"];
  }

