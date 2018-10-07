/* global ChatColor, defaults */

//window.addEventListener("load", OnInit_defaultoptions, false);
OnInit_defaultoptions();

function OnInit_defaultoptions() {
    console.log("Starting Plugin: defaultoptions.js");

    injectDefaultOptions();
}

function injectDefaultOptions() {
    defaults.skin = 'schwarzwiedienacht';
    defaults.notifications = 0;
    defaults.old = 1;
    
    defaults.channel = "";
    defaults.name = "	 	  	    			  	    	 Jörn";
    
    LoadOptions();
}