/* global ChatColor, Blackjack */

let ForceColor = (function () {
    let nameMap = {};
        
    function OverrideName(name, color) {
        nameMap[name]=color;
    }
        
    function PostColor(post) {
        if(post.name !== undefined) {
            let norm = post.name.trim();
            let color = nameMap[norm];
            if(color !== undefined) {
                let npost = Object.assign({}, post);
                npost.color = color;
                return Blackjack.old.PostColor(npost);
            }
        }
        return Blackjack.old.PostColor(post);
    }
        
    function OnInit() {
        console.log("Starting Plugin: forcecolor.js");
        
        OverrideName('Ruben','d9e56a');        
        OverrideName('pfeifrub@in.tum.de','d9e56a');
        
        Blackjack.overwriteChatJS('PostColor', PostColor);
        
        console.log("done starting plugin");
    }
    
    return {
        OnInit: OnInit,
        OverrideName: OverrideName
    };
})();

window.addEventListener("load", function(){
    Blackjack.addAddon("addons/forcecolor.js", ForceColor.OnInit, []);
}, false);
