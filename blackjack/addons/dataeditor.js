/* global  Blackjack */

let DataEditor = (function () {
    function OnInit() {
        // create default tab
        let data = [
            ['name']
        ];
    }
    
    function RegisterTab(tab) {
        
    }
    
    // for documentation see "namedialog.js"
    function MakeTab(rows) {
        
    }
    
    return {
        Tab: Tab,
        OnInit: OnInit,
        RegisterTab: RegisterTab
    };
})();

window.addEventListener("load", function(){
    Blackjack.addAddon("addons/dataeditor.js", DataEditor.OnInit, []);
}, false);
