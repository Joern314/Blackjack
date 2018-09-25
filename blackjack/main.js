/* global browser */


// remove old chat.js from the headers
console.log("Removing old chat.js");

let oldChatNode = document.querySelector('script[src="chat.js"]');
oldChatNode.remove();

console.log(oldChatNode);

// inject our javascript addons
injectLocalScript("addons/namecolor.js");

// inject our javascript libraries
injectLocalScript("js/md5.min.js");

function injectLocalScript(file) {
    console.log("Injecting script: "+file);
    
    let elem = document.createElement('script');
    elem.src = browser.runtime.getURL(file);
    elem.type = 'text/javascript';
    document.head.appendChild(elem);
    
    console.log("done");
}