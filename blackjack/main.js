/* global browser */


// remove old chat.js from the headers
/*
let selector = 'script[src="chat.js"]';

let observer = new MutationObserver((mutations) => mutations.forEach((mutation) => {
    let nodes = Array.from(mutation.addedNodes);
    for(let node of nodes) {
        console.log("node");
        if(node.matches && node.matches(selector)) {
            observer.disconnect();
            deleteOldChatNode(node);
            return;
        }
    }
}));
observer.observe(document.documentElement, {childList: true, subtree: true});

function deleteOldChatNode(node) {
    console.log("Removing old chat.js");
    node.remove();
    console.log(node);
}

*/

/*
// redirect "chat.js"
let pattern = "https://chat.qed-verein.de/*";
function redirect(requestDetails) {
    console.log("chat.js was requested");
    return {
        cancel: true
    };
}
browser.webRequest.onBeforeRequest.addListener(
   redirect,
   {urls:[pattern], types:["main_frame"]},
   ["blocking"]
);
*/

// REPLACE WITH MODIFIED index.html
/*
let localIndexHtml = browser.runtime.getURL("modified/index.html");
const req = new XMLHttpRequest();

req.onreadystatechange = function(event) {
    if(this.readystate === XMLHttpRequest.DONE) {
        if(this.status === 200) {
            console.log("received modified index.html");
        } else {
            console.log("error: %d (%s)", this.status, this.statusText);
        }
    }
}
req.open('GET', localIndexHtml, true);
req.send(null);

document.open();
document.write();
document
*/

// DETECT TYPE OF WEBSITE
// TODO 

// INJECT NEW STUFF

injectAddonsAndLibraries();

function injectAddonsAndLibraries() {
    // overwrite some chat functions
    
    // inject our javascript addons
    injectLocalScript("addons/namecolor.js");

    // inject our new stylesheets
    injectLocalCSS("css/namecolor.css");

    // inject our javascript libraries
    injectLocalScript("js/md5.min.js");
}
    
function injectLocalScript(file) {
    console.log("Injecting script: " + file);

    let elem = document.createElement('script');
    elem.src = browser.runtime.getURL(file);
    elem.type = 'text/javascript';
    document.head.appendChild(elem);
}

function injectLocalCSS(file) {
    //<link rel="stylesheet" type="text/css" href="common.css">
    console.log("Injecting css: "+file);
    
    let elem = document.createElement('link');
    elem.rel = "stylesheet";
    elem.type = "text/css";
    elem.href = browser.runtime.getURL(file);
    document.head.appendChild(elem);
}