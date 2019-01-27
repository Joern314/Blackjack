/* global ChatColor, Blackjack, Observables, DataEditor */

let NameDialog = (function () {
    // list of favourite names
    let favouritenames = [];
    // list of ids
    const group = "namedialog";

    const id_modal = group + "_modal";
    const id_close1 = group + "_close1";
    const id_close2 = group + "_close1";
    const id_fav_text = group + "_fav_text";
    const id_fav_datalist = group + "_fav_datalist";
    const id_color_text = group + "_color_text";
    const id_color_chooser = group + "_color_chooser";
    const id_color_button = group + "_color_button";
    const obs_color = "obs_" + group + "_color";

    // html code
    const html_Head =
            `
        <input id="${id_close1}" type="button" value="Schließen" tabindex="100"
               onclick="Observables['menu']=''">
        <input id="${id_fav_text}" type="text" value="" tabindex="101"
               list="${id_fav_datalist}"
               oninput="Observables['name']=this.value;" >
        <datalist id="${id_fav_datalist}"></datalist>

        <input id="${id_color_text}" type="text" value="none" size="5" tabindex="102"
               onchange="Observables['${obs_color}']=NameDialog.parseColor(this.value)">

        <input id="${id_color_chooser}" type="color" style="display:none;"
               onchange="Observables['${obs_color}']=NameDialog.parseColor(this.value)"
               oninput="Observables['${obs_color}']=NameDialog.parseColor(this.value)">
        <input id="${id_color_button}" type="button" tabindex="103" value=" " 
               onclick="document.getElementById('${id_color_chooser}').click()">

        <input id="${id_close2}" type="button" value="Schließen" tabindex="104"
               style="float:right;"
               onclick="Observables['menu']=''">
    `;

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
            return colorHex;
        } else {
            return "#646464";
        }
    }

    function addFavouriteName(name) {
        let child = document.createElement('option');
        child.value = name;
        document.getElementById(id_fav_datalist).appendChild(child);
    }


// add suggestions to the vanilla name-field
    function patchNameField() {
        let name = document.getElementById("name");
        name.setAttribute("list", id_fav_datalist);
        name.setAttribute("type","text");

        let label = Array.from(document.getElementsByTagName("label"))
                .filter(l => l.htmlFor === "name")[0];
        
        label.setAttribute("tabIndex", "0");
        label.addEventListener('keypress', function (event) {
            //down: event.keyCode === 40 || 
            if (event.keyCode === 38 || event.keyCode === 40
                    || event.keyCode === 13) { // up,down,enter
                ////DataEditor.Open(id_modal);
            }
        }, false);
    }

    function addCallbacks() {
        Observables.subscribe('name', function () {
            document.getElementById(id_fav_text).value = Observables.name; // fill new value
            Observables[obs_color] = NameDialog.parseColor(ChatColor.calc(Observables.name));
        });

        Observables.subscribe(obs_color, function () {
            document.getElementById(id_color_chooser).value =
                    document.getElementById(id_color_text).value =
                    document.getElementById(id_color_text).style['color'] =
                    document.getElementById(id_color_button).style['background-color']
                    = Observables[obs_color];
        });
    }


    function CreateModal() {
        let modal = DataEditor.CreateNodeForModal(id_modal, html_Head, "");
        modal.focus_open = id_close1;
        modal.focus_close = "name";
        
        //DataEditor.Open(id_modal);
    }

    function OnInit() {
        CreateModal();
        patchNameField();
        addCallbacks();
        
        addFavouriteName("Gerücht");
        addFavouriteName("	 	  	    			  	    	 Jörn");
    }

    return {
        OnInit: OnInit,
        parseColor: parseColor
    };
})();

window.addEventListener("load", function () {
    Blackjack.addAddon("addons/namedialog.js", NameDialog.OnInit, []);
    //["html/namedialog.html"]);
}, false);
