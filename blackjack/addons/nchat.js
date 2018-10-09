// save a copy of all old functions

let oldChatJS = {
    LoadOptions: LoadOptions,
    OptionURL: OptionURL,
    Init: Init,
    UpgradeCookies: UpgradeCookies,
    InitSocket: InitSocket,
    SocketConnect: SocketConnect,
    SocketDisconnect: SocketDisconnect,
    OnSocketOpen: OnSocketOpen,
    OnSocketResponse: OnSocketResponse,
    OnSocketError: OnSocketError,
    OnSocketClose: OnSocketClose,
    Send: Send,
    Ping: Ping,
    ProcessPost: ProcessPost,
    AppendPost: AppendPost,
    FormatScreenPost: FormatScreenPost,
    FormatMobilePost: FormatMobilePost,
    ResizeHandler: ResizeHandler,
    IDTitle: IDTitle,
    IDString: IDString,
    DelayString: DelayString,
    RecreatePosts: RecreatePosts,
    ResetSending: ResetSending,
    InitSettings: InitSettings,
    UpdateSettings: UpdateSettings,
    Decrease: Decrease,
    Increase: Increase,
    ApplySettings: ApplySettings,
    LayoutSelected: LayoutSelected,
    URIReplaceState: URIReplaceState,
    LoadHistory: LoadHistory,
    OnHistoryResponse: OnHistoryResponse,
    OnHistoryClicked: OnHistoryClicked,
    Quote: Quote,
    ShowMenu: ShowMenu,
    InitNotifications: InitNotifications,
    SetReconnect: SetReconnect,
    UpdateReconnect: UpdateReconnect,
    SetStatus: SetStatus,
    URIEncodeParameters: URIEncodeParameters,
    URIDecodeParameters: URIDecodeParameters,
    changeFavicon: changeFavicon,
    InvertColor: InvertColor,
    PostColor: PostColor,
    ScrollDown: ScrollDown,
    HtmlEscape: HtmlEscape,
    InsertLinks: InsertLinks,
    UpdateTitle: UpdateTitle,
    ReadCookie: ReadCookie,
    LoadMathjax: LoadMathjax,
    ProcessMath: ProcessMath,
    ErrorHandler: ErrorHandler,
    LoginInit: LoginInit,
    OnLoginClicked: OnLoginClicked,
    OnLoginResponse: OnLoginResponse
};

// implement better event handling

let Blackjack = (function () {
    let observables = [
        'name'      // form field
    ];
    let methods = [
        'UpdateSettings', // to commit changes into URL  
    ];

    let resources = {};
    let addons = [];

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
            oldChatJS.UpdateSettings();
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
        
        if(newAddon !== undefined) {
            newAddon.callback();
            newAddon.initialized = true;
            resources[newAddon.name] = true;
            checkAddons();    //recursive
        } else {
            //done
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
        resourceLoaded: resourceLoaded
    };
})();

window.addEventListener("load", Blackjack.OnInit, false);

