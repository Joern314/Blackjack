// onscroll

/* global ChatColor, Blackjack, Observables */

let InfiniteScrolling = (function () {
    function getDiv() {
        return document.getElementById("posts");
    }
    
    function OnInit() {
        let div = getDiv();
        div.onscroll = function (event) {
            Observables.scrolling = 0;
        };
    }
    
    function OnScroll() {
        
    }
    
    return {
        OnInit: OnInit,
        OnScroll: OnScroll
    };
})();

/**
window.addEventListener("load", function(){
    Blackjack.addAddon("addons/infinitescrolling.js", InfiniteScrolling.OnInit, []);
}, false);
*/