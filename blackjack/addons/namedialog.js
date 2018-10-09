/* global ChatColor, Blackjack */

let NameDialog = (function () {
    // list of favourite names
    let favouritenames = [];

    function ToggleDropdown() {
        let modal = document.getElementById("namedialogbox");
        let color = document.getElementById("namedialogcolor");
        let close = document.getElementById("namedialogclose");
        let close2 = document.getElementById("namedialogclose2");
        modal.style.display = "block";
        let colorHex = "#" + ChatColor.getCurrent();
        setNameDialogColor(parseColor(colorHex));
        close.focus();
    }

    function OpenColorChooser() {
        let namedialogcolor = document.getElementById("namedialogcolor");
        namedialogcolor.click();
    }

    function parseColor(colorHex) {
        if (/^([0-9a-fA-F]{6})$/.test(colorHex)) {
            colorHex = "#" + colorHex;
        } else if (/^(\#[0-9a-fA-F]{6})$/.test(colorHex)) {
        } else {
            colorHex = undefined;
        }

        if (colorHex) {
            let red = parseInt(colorHex.slice(1, 3), 16);
            let green = parseInt(colorHex.slice(3, 5), 16);
            let blue = parseInt(colorHex.slice(5, 7), 16);
            if (red < 100 || green < 100 || blue < 100) {
                colorHex = undefined;
            }
        }

        if (colorHex) {
            return {text: colorHex, color: colorHex};
        } else {
            return {text: "none", color: "#646464"};
        }
    }

    function setNameDialogColor(colorHex) {
        let color = document.getElementById("namedialogcolor");
        let colortext = document.getElementById("namedialogcolortext");
        let colorbutton = document.getElementById("namedialogcolorbutton");
        color.value = colorHex.color;
        colortext.value = colorHex.text;
        colortext.style['color'] = colorHex.color;
        colorbutton.style['background-color'] = colorHex.color;
    }

    function addFavouriteName(name) {
        let favouritenames = document.getElementById("favouritenames");
        let child = document.createElement('option');
        child.value = name;
        favouritenames.appendChild(child);
    }

    function Close() {
        let modal = document.getElementById("namedialogbox");
        modal.style.display = "none";
        
        let name = document.getElementById("name");
        name.focus();
    }

    function OnObservableChange(event) {
        switch (event.detail.key) {
            case 'name':
                let namedialogfavourite = document.getElementById("namedialogfavourite");
                namedialogfavourite.value = event.detail.value; // fill new value
                break;
        }
    }

    function addCallbacks() {
        let name = document.getElementById("name");
        name.addEventListener('keypress', function (event) {
            if (event.keyCode === 38 || event.keyCode === 40) { // down or up
                ToggleDropdown();
            }
        }, false);
        
        let modal = document.getElementById("namedialogbox");
        modal.addEventListener('keypress', function (event) {
            if (event.keyCode === 27) { // escape
                Close();
            }
        }, false);

        Blackjack.addObservator('name', OnObservableChange);
    }

    function OnInit() {
        console.log("Starting Plugin: namedialog.js");
        addFavouriteName("	 	  	    			  	    	 Jörn");
        addCallbacks();
    }

    function OnInput(obj) {
        switch (obj) {
            case 'namedialogfavourite':
            {
                let namedialogfavourite = document.getElementById("namedialogfavourite");
                Blackjack.setObservable('name', namedialogfavourite.value, 'namedialogfavourite.oninput');
                break;
            }
            case 'namedialogcolor':
            {
                let color = document.getElementById("namedialogcolor");
                let colorHex = parseColor(color.value);
                setNameDialogColor(colorHex);
            }
        }
    }

    function OnChange(obj) {
        switch (obj) {
            case 'namedialogcolortext':
            {
                let namedialogcolortext = document.getElementById("namedialogcolortext");
                let colorHex = parseColor(namedialogcolortext.value);
                setNameDialogColor(colorHex);
                break;
            }
            case 'namedialogcolor':
            {
                let namedialogcolor = document.getElementById("namedialogcolor");
                let colorHex = parseColor(namedialogcolor.value);
                setNameDialogColor(colorHex);
                break;
            }
        }
    }

    return {
        OnInit: OnInit,
        Close: Close,
        OnInput: OnInput,
        OnChange: OnChange,
        OpenColorChooser: OpenColorChooser
    };
})();

window.addEventListener("load", function () {
    Blackjack.addAddon("addons/namedialog.js", NameDialog.OnInit, ["html/namedialog.html"]);
}, false);
