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
        "special": {
            "background": "#0B1D2F",
            "foreground": "#c6eef3",
            "cursor": "#c6eef3"
        },
        "colors": {
            "color0": "#0B1D2F",
            "color1": "#116D91",
            "color2": "#4F708B",
            "color3": "#1A91A9",
            "color4": "#35BAD0",
            "color5": "#5BE4F5",
            "color6": "#A6AEAD",
            "color7": "#c6eef3",
            "color8": "#8aa6aa",
            "color9": "#116D91",
            "color10": "#4F708B",
            "color11": "#1A91A9",
            "color12": "#35BAD0",
            "color13": "#5BE4F5",
            "color14": "#A6AEAD",
            "color15": "#c6eef3"
        }
    }`;

    // html code
    const html_Head =
            `
        <input id="${id_close1}" type="button" value="Schließen" tabindex="100"
               onclick="DataEditor.Close('${id_modal}')">
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
        let colors = {  //apfelweis, nachtschwarz
            bg_0: obj.colors.color0, // #eee 000
            br_0: obj.colors.color1, // #aaa 666
            fg_0: obj.special.foreground, // #444 ccc
            bg_1: obj.special.background, // #ddd 111
            fg_1: obj.special.color1,  // #333
            theme: this.bg_1
        };
        let css = `
.${name}, .${name} input, .${name} textarea, .${name} select
{
	color: ${colors.fg_0};
	background-color: ${colors.bg_0};
	border-color: ${colors.br_0};
}

.${name} .box
{
	background-color: ${colors.bg_1};
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

        DataEditor.Open(id_modal);
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
