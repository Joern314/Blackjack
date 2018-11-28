# BLACKJACK

## GETTING STARTED

Blackjack was tested exclusively on Firefox/Ubuntu.
Principally it should run on every modern browser (no Internet Explorer, duh).
On mobiles, I only know of Firefox/Android to be able to use web extensions.

### PREREQUISITES

None

### INSTALLATION - FIREFOX

1. Clone this git repository / download as zip and unpack
```
git clone https://github.com/Joern314/Blackjack.git
```

2. Follow the instructions of https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Installing

   1. Open firefox

   2. Open [about:debugging](about:debugging) in the addressbar

   3. Click "load temporary addons". Blackjack should be listed under "Temporary Extensions" now.

   4. Navigate to the folder with this repository, select any file. For example: "manifest.json"

3. Reload the tabs with the chat, or open a new one

4. You need to do repeat steps 2 and 3 after every restart of firefox.

## UPDATES & EXPERIMENTING

Any changes to manifest.json and "nchat.js" require you to press the "reload" text in the [about:debugging](about:debugging) page under "Temporary Extensions".

Any changes to the other ".js" files will be reflected after simply reloading the tabs.

For now no auto-updates are implemented, and I don't exactly feel like enabling them per default in the future.

## USING BLACKJACK

Blackjack is highly experimental for now, unstable and highly broken.

### COLLECTED DATA

None, I think. In near future Blackjack will use local storage on your computer to save your settings, but it won't send anything to me.
I do not guarantee any form of safety, though, especially if you visit 3rd party sites that contain iframes of qed-chat or similar weird shit.
Report any security concerns to me at once, best with a suggestion what design pattern to use instead!