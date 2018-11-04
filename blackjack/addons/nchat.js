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

// implement better event handling

let Blackjack = (function () {
    let observables = [
        'name'      // form field
    ];
    let methods = [
        'UpdateSettings' // to commit changes into URL  
    ];

    let resources = {};
    let addons = [];
    
    let old = saveOldFunctions();

    /**
     * change value of observable, similar to onchange&oninput.
     * Example: Blackjack.setObservable('name', 'Cybergirl');
     * An event is fired to all observers.
     * Default observers will reflect these changes upon the default form fields.
     */
    function setObservable(key, value, cause = undefined) {
        let event = new CustomEvent('bj-set-' + key, {
            detail: {
                key: key,
                operation: 'set',
                value: value,
                cause: cause
            }
        });

        window.dispatchEvent(event);
    }

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

    function addObservator(key, callback) {
        window.addEventListener('bj-set-' + key, callback, false);
    }

    function addMethodListener(key, callback) {
        window.addEventListener('bj-call-' + key, callback, false);
    }

    function OnInit() {
        saveOldFunctions();
        
        redirectEventCallbacks();
        addDefaultObservers();
    }

    function redirectEventCallbacks() {
        let elem_name = document.getElementById('name');
        elem_name.onchange = function (event) {
            setObservable('name', event.target.value, 'name.onchange');
            callMethod('UpdateSettings', 'name.onchange');
        };
        elem_name.oninput = function (event) {
            setObservable('name', event.target.value, 'name.oninput');
        };
    }

    function addDefaultObservers() {
        // name field
        addObservator('name', function (event) {
            // detect if this event was caused by the gui.
            if (event.detail.cause === 'name.onchange' || event.detail.cause === 'name.oninput') {
                // no need to update document body
            } else {
                let elem_name = document.getElementById('name');
                elem_name.value = event.detail.value;
            }
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

    function checkAddons() {
        let newAddon = addons.find(addon => (addon.initialized === false) &&
                    addon.resources.every(f => resources[f] === true));

        if (newAddon !== undefined) {
            console.log(`Starting Plugin: ${newAddon.name}`);
            newAddon.callback();
            newAddon.initialized = true;
            resources[newAddon.name] = true;
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
        setObservable: setObservable,
        addObservator: addObservator,
        resourceLoaded: resourceLoaded,
        overwriteChatJS: overwriteChatJS,
        old: old
    };
})();

window.addEventListener("load", Blackjack.OnInit, false);

