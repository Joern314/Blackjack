/* global ChatColor, Blackjack */

let NameColor = (function () {
    function OnInit() {
        console.log("Starting Plugin: namecolor.js");
        
        Blackjack.addObservator('name', function(event) {
            // set new color
            let newValue = event.detail.value;
            recolor(newValue);
        });
        
        console.log("done starting plugin");
    }
    
    function recolor(newValue) {
        let colorHex = ChatColor.getWithLayout(newValue);
        
        let namePart = document.getElementById("name");
        namePart.style.color = "#" + colorHex;
    }
    
    return {
        OnInit: OnInit
    };
})();

window.addEventListener("load", function(){
    Blackjack.addAddon("addons/namecolor.js", NameColor.OnInit, []);
}, false);


/*
 function rebuildUsernamesDatalist() {
 console.log(usernames);
 let elem = document.getElementById("usernameList");
 if (elem === null) {
 return;
 }
 // clear
 for (let i = elem.options.length - 1; i >= 0; i--)
 {
 elem.remove(i);
 }
 // rebuild
 for (let i = usernames.length - 1; i >= 0; i--) {
 let name = usernames[i];
 let option = document.createElement('option');
 option.value = name['name'];
 elem.appendChild(option);
 }
 }
 
 */