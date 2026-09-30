// NAME: ChromaShift
// AUTHOR: stefaceriani
// DESCRIPTION: Customise every Spotify colour from the Settings page.
// VERSION: 3.3.4

(function ChromaShift() {
  "use strict";

  if (!Spicetify?.Platform || !Spicetify?.LocalStorage) {
    setTimeout(ChromaShift, 300);
    return;
  }


