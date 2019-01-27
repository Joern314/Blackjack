/* global ChatColor, Blackjack, Observables, DataEditor, themecolors */

let ColorScheme = (function () {
    // list of ids
    const group = "colorscheme";

    const id_modal = group + "_modal";
    const id_close1 = group + "_close1";
    const id_textarea = group + "_textarea";
    const obs_json = "obs_" + group + "_json";

    const id_css = group +"_css";

    const default_colors = 
    `{
        "colors": {
            "background": "#00ff00",
            "background_box": "##ff00ff",
            "border": "#0000ff",
            "text_userid": "#ffff00",
            "text_message": "#ff0000"
        }
    }`;

    // html code
    const html_Head =
            `
        <input id="${id_close1}" type="button" value="Schließen" tabindex="100"
               onclick="Observables['menu']=''">
        <label>Custom Color-Scheme</label>
    `;

    const html_Body =
            `   
        <p class="pn">
            <textarea id="${id_textarea}"
                    onchange="Observables['${obs_json}']=this.value">
            </textarea>
        </p>
        <style id="${id_css}" type="text/css"></style>
    `;

    function verifyAndApply(json) {
        let obj = JSON.parse(json);
        let css = createCSS("custom",obj);
        document.getElementById(id_css).innerHTML = css.text;
        injectSkin("custom", css.colors);
    }
    
    function injectSkin(name, colors) {
        let skinSelect = document.getElementById('skin');
        let option;
        for(let i=0; i<skinSelect.length; i++) {
            if(skinSelect.options[i].value===name) {
                option = skinSelect.options[i]; break;
            }
        }
        if(option === undefined) {
            option = new Option(name,name);
            skinSelect.add(option);
        }
        themecolors[name] = colors.theme;
    }
    
    function createCSS(name, obj) {
        let colors = obj.colors;
        
        let css = `
.${name}, .${name} input, .${name} textarea, .${name} select
{
	color: ${colors.fg_0};
	background-color: ${colors.background};
	border-color: ${colors.br_0};
}

.${name} .box
{
	background-color: ${colors.background_box};
	border-color: ${colors.br_0};
}

.${name} .post .info, .${name} .post .userid
{
	color: ${colors.fg_1};
}
        `;
        
        return {
            text: css,
            colors: colors
        }
    }

    function addCallbacks() {
        Observables.subscribe(obs_json, function () {
            document.getElementById(id_textarea).innerHTML = Observables[obs_json];
            verifyAndApply(Observables[obs_json]);
        });
        Observables[obs_json] = default_colors;
    }


    function CreateModal() {
        let modal = DataEditor.CreateNodeForModal(id_modal, html_Head, html_Body);
        modal.focus_open = id_close1;
        modal.focus_close = "message";

        ////DataEditor.Open(id_modal);
    }

    function OnInit() {
        CreateModal();
        addCallbacks();
    }

    return {
        OnInit: OnInit
    };
})();

window.addEventListener("load", function () {
    Blackjack.addAddon("addons/colorscheme.js", ColorScheme.OnInit, ["addons/dataeditor.js"]);
    //["html/namedialog.html"]);
}, false);
