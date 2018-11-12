/* global  Blackjack */

let DataEditor = (function () {
    let modals = {};
    
    function OnInit() {
    }
    
    function Close(id_modal) {
        let modal = modals[id_modal];
        document.getElementById(id_modal).style.display = "none";
        
        if(modal.focus_close !== undefined) {
            document.getElementById(modal.focus_close).focus();
        }
    }
    
    function Keypress(name, event) {
        if (event.keyCode === 27) { // escape
            Close(name);
        }
    }
    
    function Open(id_modal) {
        let modal = modals[id_modal];
        document.getElementById(id_modal).style.display = "block";
        
        if(modal.focus_open !== undefined) {
            document.getElementById(modal.focus_open).focus();
        }
    }
    
    function CreateTable(modalName, idTable, columnList, editable=[true]) {
        
        let html = 
        `
        <div>
            <table id="${idTable}">
            </table>
        </div>
        `;
        
        return {
            innerHTML: html,
            asNode: () => document.getElementById(idTable),
            insertRow: function(index, row) {
                let node_row = document.getElementById(idTable).insertRow(index);
                for(let i=0; i<row.length; i++) {
                    let cell = node_row.insertCell(i);
                    cell.innerHTML = row[i];
                    
                    if(editable[Math.min(editable.length-1, i)]) {
                        cell.setAttribute("contenteditable", "true");
                    }
                }
            },
            removeRow: index => document.getElementById(idTable).removeRow(index),
        };
    }

    function CreateNodeForModal(id_modal, htmlHead="", htmlBody=undefined) {
        let node = document.createElement("div");
        let pclass = "p";
        if(htmlBody === undefined || htmlBody === "") {
            htmlBody = "";
            pclass = "pn";
        }
        node.innerHTML =
        `
        <div id="${id_modal}" class="box editorbox"
            onkeypress="DataEditor.Keypress('${id_modal}',event)"> 
            <p class="${pclass}"> 
                ${htmlHead}
            </p>
            ${htmlBody}
        </div>
        `;
        
        document.body.appendChild(node);
        
        modals[id_modal] = {
            id: id_modal,
            focus_open: undefined,
            focus_close: "message"
        };
        return modals[id_modal];
    }

    return {
        Open: Open,
        Close: Close,
        Keypress: Keypress,
        OnInit: OnInit,
        CreateNodeForModal: CreateNodeForModal
    };
})();

window.addEventListener("load", function () {
    Blackjack.addAddon("addons/dataeditor.js", DataEditor.OnInit, []);
}, false);
