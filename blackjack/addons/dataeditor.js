/* global  Blackjack */

let DataEditor = (function () {
    function OnInit() {
        CreateNodeForModal('test', '');
        Open('test');
    }
    
    function Close(name) {
        console.log(`Closing ${name}`);
        let id_modal = name+"-modal";
        let modal = document.getElementById(id_modal);
        modal.style.display = "none";
        
        let msg = document.getElementById("message");
        msg.focus();
    }
    
    function Open(name) {
        let id_modal = name+"-modal";
        let modal = document.getElementById(id_modal);
        modal.style.display = "block";
        
        let id_close = name+"-close";
        let close = document.getElementById(id_close);
        close.focus();
    }
    
    function CreateTable(tableName, columnList, rowList) {
        let div = document.createElement("div");
        let table = document.createElement("table");
        
        // column names
        
    }

    function CreateNodeForModal(name, innerHTML) {
        let id_modal = name+"-modal";
        let id_close = name+"-close";
        let str_label = name;
        let callback_close = `DataEditor.Close('${name}')`;
        
        let node = document.createElement("div");
        node.innerHTML =
        `
        <div id="${id_modal}" class="box editorbox"> 
            <p> 
                <input id="${id_close}" type="button" value="Schließen" tabindex="100"
                    onclick="${callback_close}">

                <label>${str_label}</label>
            </p>
            ${innerHTML}
        </div>
        `;
        
        document.body.appendChild(node);
        return node;
    }

    function RegisterTab(tab) {

    }

    // for documentation see "namedialog.js"
    function MakeTab(rows) {

    }

    return {
        Close: Close,
        Open: Open,
        OnInit: OnInit,
        RegisterTab: RegisterTab
    };
})();

window.addEventListener("load", function () {
    Blackjack.addAddon("addons/dataeditor.js", DataEditor.OnInit, []);
}, false);
