/* global ChatColor, defaults */

//window.addEventListener("load", OnInit_defaultoptions, false);
//OnInit_defaultoptions();

function OnInit_defaultoptions() {
    console.log("Starting Plugin: defaultoptions.js");

    injectDefaultOptions();
}


let DefaultOptions = function () {
    function OnInit() {
        upgradeOptions();
        Blackjack.overwriteChatJS('LoadOptions', new_LoadOptions);
        Blackjack.overwriteChatJS('OptionURL', new_OptionURL);
        injectDefaultOptions();
    }

    function reInit() {
        RecreatePosts();
        SocketConnect();
        InitSettings();
        InitNotifications();
    }

    function injectDefaultOptions() {
        options.setDefaultAndValue("skin", 'schwarzwiedienacht');
        options.setDefaultAndValue("notifications", 0);
        options.setDefaultAndValue("old", 1)

        options.setDefaultAndValue("channel", "");
        options.setDefaultAndValue("name", "	 	  	    			  	    	 Jörn");

        reInit();
    }

    function upgradeOptions() {
        let oldoptions = window.options;

        window.options = new Proxy({
            linkobvs: new Object(),
            link: function (option, observable, defval, type = "String") {
                this.linkobvs[option] = { obv: observable, defval: defval, type: type };
            },
            getDefault: function (option) {
                return this.linkobvs[option].defval;
            },
            getValue: function (option) {
                return window.options[option];
            },
            getType: function (option) {
                return this.linkobvs[option].type;
            },
            keyObj: function () {
                return this.linkobvs;
            },
            setDefault: function (option, defval) {
                this.linkobvs[option].defval = defval;
            },
            setDefaultAndValue: function (option, defval) {
                this.setDefault(option, defval);
                window.options[option] = defval;
            }
        }, {
                has: function (obj, prop) {
                    return prop in obj.linkobvs;
                },

                get: function (obj, prop) {
                    if (prop in obj) {
                        return obj[prop];
                    } else if (prop in obj.linkobvs) {
                        return Observables[obj.linkobvs[prop].obv];
                    } else {
                        return undefined;
                    }
                },
                set: function (obj, prop, value) {
                    if (prop in obj) {
                        obj[prop] = value;
                    } else if (prop in obj.linkobvs) {
                        Observables[obj.linkobvs[prop].obv] = value;
                    } else {
                        //ignore
                    }
                }
            });

        // from chat.js
        let integerOptions = ['last', 'limit', 'wait', 'showids'];
        let booleanOptions = ['botblock', 'old', 'publicid', 'delay', 'links', 'title', 'math', 'notifications', 'favicon'];
        let defaults = {
            channel: "", name: "",
            last: 24, botblock: 0, old: 0, publicid: 0, delay: 0, links: 1, title: 1, math: 0, showids: 4,
            notifications: 1, favicon: 1,
            layout: 'screen', skin: 'dunkelgrauton',
            limit: 256, wait: 1
        };

        let stringOptions = ['channel', 'name', 'skin', 'layout'];

        let optgroups = [integerOptions, booleanOptions, stringOptions];
        let opttypes = ["int", "bool", "string"];
        for (let g of [0, 1, 2]) {
            for (let opt of optgroups[g]) {
                window.options.link(opt, "opt-" + opt, defaults[opt], opttypes[g]);
                window.options[opt] = defaults[opt];
            }
        }
    }

    function new_LoadOptions() {
        params = URIDecodeParameters();
        for (let opt in window.options.keyObj()) {
            let val = params.hasOwnProperty(opt) ? params[opt] : window.options.getDefault(opt);
            let type = window.options.getType(opt);
            if (type === "int")
                val = parseInt(val);
            if (type === "bool")
                val = parseInt(val) ? 1 : 0;
            window.options[opt] = val;
        }
    }

    function new_OptionURL() {
        var tempOptions = new Object();
        for (let opt in window.options.keyObj()) {
            if (window.options[opt] != window.options.getDefault(opt)) {
                tempOptions[opt] = window.options[opt];
            }
        }
        url = URIEncodeParameters(tempOptions);
        return url;
    }

    return {
        OnInit: OnInit,
    };
}();

/*
window.addEventListener("load", function () {
    Blackjack.addAddon("addons/defaultoptions.js", DefaultOptions.OnInit, []);
}, false);
*/