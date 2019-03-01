/* global FormatScreenPost, FormatMobilePost, recvPart, options */

const Ignore = function () {

    let hiddenNames = [];

    function norm(name) {
        return name.normalize().trim().toLowerCase();
    }
    function isHidden(post) {
        if (Observables["ignoreflag"] == false) {
            return false; // deactivated
        }
        return hiddenNames.includes(norm(post["name"]));
    }
    function addHiddenName(name) {
        hiddenNames.push(norm(name));
        localStorage["hiddenNames"] = JSON.stringify(hiddenNames);
        window.RecreatePosts();
    }
    function removeHiddenName(name) {
        hiddenNames = hiddenNames.filter(n => n !== norm(name));
        localStorage["hiddenNames"] = JSON.stringify(hiddenNames);
        window.RecreatePosts();
    }

    function new_AppendPost(post) {
        if (options['botblock'] && post['bottag'] == '1')
            return;

        if (isHidden(post)) {
            return;
        }

        if (options['layout'] == 'mobile')
            container.appendChild(window.FormatMobilePost(post));
        else
            container.appendChild(window.FormatScreenPost(post));
    }

    function hideContent(post) {
        let copy = Object.assign({}, post);
        copy["name"] = "nil";
        copy["message"] = "";
        copy["color"] = "646464";
        if (copy["username"] == null) {
            copy["user_id"] = "";
            copy["username"] = post["name"].trim();
        }
        return copy;
    }

    function new_FormatScreenPost(post) {
        if (isHidden(post)) {
            post = hideContent(post);
        }
        return Blackjack.old.FormatScreenPost(post);
    }
    function new_FormatMobilePost(post) {
        if (isHidden(post)) {
            post = hideContent(post);
        }
        return Blackjack.old.FormatMobilePost(post);
    }

    function OnInit() {
        console.log("loaded Ignore.js");
        console.log("call Ignore.add(name: string) and Ignore.remove(name: string).");
        console.log("set 'Sinn anzeigen' to hide posts. unset to show posts.");
        console.log("Hover above the ID-Field to see name of hidden poster.");
        console.log("Good luck.");

        Blackjack.overwriteChatJS('FormatScreenPost', new_FormatScreenPost);
        Blackjack.overwriteChatJS('FormatMobilePost', new_FormatMobilePost);
        Blackjack.overwriteChatJS('AppendPost', new_AppendPost);

        RemoveSettings.AddCheckbox("ignoreflag", "ignoreflag", "ignore");
        Observables.subscribe("ignoreflag", function () {
            window.RecreatePosts();
        });

        if (localStorage["hiddenNames"] != null) {
            let old = JSON.parse(localStorage["hiddenNames"]);
            old.forEach(n => addHiddenName(n));
            console.log("loaded hidden names: ");
            console.log(hiddenNames);
        } else {
            hiddenNames = [];
            console.log("no stored hidden names found.");
        }
    }

    return {
        OnInit: OnInit,
        add: addHiddenName,
        remove: removeHiddenName
    };
}();

window.addEventListener("load", function () {
    Blackjack.addAddon("addons/ignore.js", Ignore.OnInit, ["addons/removesettings.js"]);
}, false);