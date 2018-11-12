// save a copy of all old functions

function saveOldFunctions() {
    return {
        LoadOptions: window.LoadOptions,
        OptionURL: window.OptionURL,
        Init: window.Init,
        UpgradeCookies: window.UpgradeCookies,
        InitSocket: window.InitSocket,
        SocketConnect: window.SocketConnect,
        SocketDisconnect: window.SocketDisconnect,
        OnSocketOpen: window.OnSocketOpen,
        OnSocketResponse: window.OnSocketResponse,
        OnSocketError: window.OnSocketError,
        OnSocketClose: window.OnSocketClose,
        Send: window.Send,
        Ping: window.Ping,
        ProcessPost: window.ProcessPost,
        AppendPost: window.AppendPost,
        FormatScreenPost: window.FormatScreenPost,
        FormatMobilePost: window.FormatMobilePost,
        ResizeHandler: window.ResizeHandler,
        IDTitle: window.IDTitle,
        IDString: window.IDString,
        DelayString: window.DelayString,
        RecreatePosts: window.RecreatePosts,
        ResetSending: window.ResetSending,
        InitSettings: window.InitSettings,
        UpdateSettings: window.UpdateSettings,
        Decrease: window.Decrease,
        Increase: window.Increase,
        ApplySettings: window.ApplySettings,
        LayoutSelected: window.LayoutSelected,
        URIReplaceState: window.URIReplaceState,
        LoadHistory: window.LoadHistory,
        OnHistoryResponse: window.OnHistoryResponse,
        OnHistoryClicked: window.OnHistoryClicked,
        Quote: window.Quote,
        ShowMenu: window.ShowMenu,
        InitNotifications: window.InitNotifications,
        SetReconnect: window.SetReconnect,
        UpdateReconnect: window.UpdateReconnect,
        SetStatus: window.SetStatus,
        URIEncodeParameters: window.URIEncodeParameters,
        URIDecodeParameters: window.URIDecodeParameters,
        changeFavicon: window.changeFavicon,
        InvertColor: window.InvertColor,
        PostColor: window.PostColor,
        ScrollDown: window.ScrollDown,
        HtmlEscape: window.HtmlEscape,
        InsertLinks: window.InsertLinks,
        UpdateTitle: window.UpdateTitle,
        ReadCookie: window.ReadCookie,
        LoadMathjax: window.LoadMathjax,
        ProcessMath: window.ProcessMath,
        ErrorHandler: window.ErrorHandler,
        LoginInit: window.LoginInit,
        OnLoginClicked: window.OnLoginClicked,
        OnLoginResponse: window.OnLoginResponse
    };
}

let Observables = new Proxy({
    values: new Object(),
    listeners: new Object(),
    subscribe: function(key, callback) {
        if(this.listeners[key] === undefined) this.listeners[key] = [];
        this.listeners[key].push(callback);
    },
    unsubscribe: function(key, callback) {
        if(this.listeners[key] === undefined) this.listeners[key] = [];
        let index = this.listeners[key].indexOf(callback);
        if(index !== undefined) this.listeners[key].splice(index, 1);
    },
    notify: function(key) {
        if(this.listeners[key] === undefined) this.listeners[key] = [];
        for(let i=0; i<this.listeners[key].length; i++) {
            this.listeners[key][i](); //callback
        }
    }
}, {
    has: function (obj, prop) {
        return prop in obj.values;
    },
    
    get: function (obj, prop) {
        if(prop in obj) {
            return obj[prop];
        } else if(prop in obj.values) {
            return obj.values[prop];
        } else {
            return undefined;
        }
    },
    set: function (obj, prop, value) {
        if(prop in obj) {
            obj[prop] = value;
        } else {
            let oldval = obj.values[prop];
            obj.values[prop] = value;
            if(oldval !== value) {
                obj.notify(prop);
            } else {}   //ignore if no change
        }
    }
});

// implement better event handling

let Blackjack = (function () {

    let methods = [
        'UpdateSettings' // to commit changes into URL  
    ];

    let resources = {};
    let addons = [];

    let old = saveOldFunctions();

    /**
     * similar to setObservable. does not have a value.
     */
    function callMethod(key, cause = undefined) {
        let event = new CustomEvent('bj-call-' + key, {
            detail: {
                key: key,
                operation: 'call',
                cause: cause
            }
        });

        window.dispatchEvent(event);
    }

    function addMethodListener(key, callback) {
        window.addEventListener('bj-call-' + key, callback, false);
    }

    function OnInit() {
        saveOldFunctions();

        loadDefaultObservables();
        redirectEventCallbacks();
        addDefaultObservers();
    }

    function redirectEventCallbacks() {
        let elem_name = document.getElementById('name');
        elem_name.onchange = function (event) {
            Observables.name = event.target.value;
            callMethod('UpdateSettings', 'name.onchange');
        };
        elem_name.oninput = function (event) {
            Observables.name = event.target.value;
        };
    }

    function loadDefaultObservables() {
        Observables.name = document.getElementById('name').value;
    }

    function addDefaultObservers() {
        Observables.subscribe('name', function () {
            document.getElementById('name').value = Observables.name;
        });

        // when important settings were committed
        addMethodListener('UpdateSettings', function (event) {
            old.UpdateSettings();
        });
    }

    function addAddon(name, onInitCallback, resources = []) {
        addons.push({
            name: name,
            initialized: false,
            callback: onInitCallback,
            resources: resources
        });
        checkAddons();
//        addMethodListener('InitAddons', function (event) {
//            onInitCallback();
//        });
    }

    function loadAddon(newAddon) {
        console.log(`Starting Plugin: ${newAddon.name}`);
        newAddon.callback();
        newAddon.initialized = true;
        resources[newAddon.name] = true;
        console.log(`Done Starting Plugin: ${newAddon.name}`);
    }

    function checkAddons() {
        let newAddon = addons.find(addon => (addon.initialized === false) &&
                    addon.resources.every(f => resources[f] === true));

        if (newAddon !== undefined) {
            loadAddon(newAddon);
            checkAddons();    //recursive
        } else {
            //done
        }
    }

    function overwriteChatJS(name, fun) {
        if (old[name] !== undefined) {
            window[name] = fun;
        } else {
            console.log('error: overwriting undefined old chat functionality.');
        }
    }


    function resourceLoaded(file) {
        resources[file] = true;

        checkAddons();
    }

    return {
        OnInit: OnInit,
        addAddon: addAddon,
        resourceLoaded: resourceLoaded,
        overwriteChatJS: overwriteChatJS,
        old: old
    };
})();

window.addEventListener("load", Blackjack.OnInit, false);

