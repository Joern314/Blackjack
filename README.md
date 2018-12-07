# BLACKJACK

## GETTING STARTED

Blackjack was tested exclusively on Firefox/Ubuntu.
Principally it should run on every modern browser (no Internet Explorer, duh).
On mobiles, I only know of Firefox/Android to be able to use web extensions.

### PREREQUISITES

None

### INSTALLATION - FIREFOX

Blackjack can be either from an `.xpi` file or from the source. Latter option only temporarily adds Blackjack, and is better suited for testing and debugging.

#### AUTOMATIC INSTALLATION

Click this [link](https://joern314.github.io/Blackjack/blackjack/web-ext-artifacts/release-newest.xpi). 
You should be asked whether you want to install the addon `Blackjack`.

#### MANUAL INSTALLATION FROM SOURCE

Alternatively you can install a local version of Blackjack from the source.

1. Clone this git repository / download as zip and unpack
```
git clone https://github.com/Joern314/Blackjack.git
```

2. Follow the instructions on 
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#Installing

   1. Open firefox

   2. Open `about:debugging` in the addressbar

   3. Click `load temporary addons`. Blackjack should be listed under "Temporary Extensions" now.

   4. Navigate to the subfolder `blackjack` within this repository, select any file, e.g. `blackjack/manifest.json`

3. Reload the tabs with the chat, or simply open a new one.

4. You need to do repeat steps 2 and 3 after every restart of firefox.

## UPDATES

### AUTOMATIC INSTALLATION

Firefox will look for new updates every 24 hours or so.

### MANUAL INSTALLATION FROM SOURCE

Any changes to `blackjack/manifest.json` and `blackjack/main.js` require you to press the `reload` text in 
the `about:debugging` page under "Temporary Extensions".

Any changes to the other files, including the `blackjack/addons/*.js`, will be reflected after simply reloading the tabs.

For now no auto-updates are implemented, and I don't exactly feel like enabling them per default in the future.

#### UPDATING VIA GIT

If you cloned this repository, you should be able to simply pull the newest version. Navigate to the root folder of Blackjack. 
You should see the `README.md` and the folders `blackjack` and `nbproject`. 

Then pull, and check [UPDATES](#updates) for how to reload Blackjack.
```
git pull
```

## USING BLACKJACK

Blackjack is highly experimental for now, unstable and highly broken.

### FEEDBACK

Give me feedback! You can ask me to add things to the TODO-List, or simply use 
all those unknown features of github to send me messages and bug reports.

However: remember that Blackjack is experimental, so don't bother me with *obvious* things,
unless you can present an elegant solution as well. In that case you might want to consider
forking an sending a pull-request.

### COLLECTED DATA

None, I think. In near future Blackjack will use local storage on your computer to save your settings, 
but it won't send anything to me.

### SAFETY

I do not guarantee any form of safety, especially if you visit 3rd party sites that contain 
iframes of qed-chat or similar weird shit.
Report any security concerns to me at once, best with a suggestion what design pattern to use instead!
