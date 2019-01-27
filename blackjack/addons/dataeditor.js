/* global  Blackjack, Observables, RemoveSettings */

let DataEditor = (function () {
    let modals = new Map();
    
    function OnInit() {
        injectModalList();
    }
    
    function nClose(id_modal) {
        let modal = modals.get(id_modal);
//      document.getElementById(id_modal).style.visibility = "hidden";
        document.getElementById(id_modal).style.display = "none";
//        document.getElementById(id_modal).hidden = true;
        
        if(modal.focus_close !== undefined) {
            document.getElementById(modal.focus_close).focus();
        }
    }
    
    function nOpen(id_modal) {
        let modal = modals.get(id_modal);
//        document.getElementById(id_modal).style.visibility = "visible";
        document.getElementById(id_modal).style.display = "block";
//        document.getElementById(id_modal).hidden = true;
        
        if(modal.focus_open !== undefined) {
            document.getElementById(modal.focus_open).focus();
        }
    }
    
    function Close(oldmenu) {
        switch(oldmenu) {
            case undefined:
            case "":
                break;
            case "settings":
            case "logs":
                window.ShowMenu('');
                break;
            default:
                nClose(oldmenu);
                break;
        }
    }
    function Open(newmenu) {
        switch(newmenu) {
            case undefined:
            case "":
                break;
            case "settings":
            case "logs":
                window.ShowMenu(newmenu);
                break;
            default:
                nOpen(newmenu);
                break;
        }
    }

    function Keypress(name, event) {
        if (event.keyCode === 27) { // escape
            Close(name);
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
        
//        node.style.display = "none"; //don't -> wrong layout
        document.body.appendChild(node);
//        node.style.visibility = "hidden";
//        node.hidden = true;
//        node.style.display = "none"; //don't -> wrong layout
        
        modals.set(id_modal, {
            id: id_modal,
            focus_open: undefined,
            focus_close: "message"
        });
        
        registerWithSelect(id_modal, id_modal);
        
        return modals.get(id_modal);
    }
    
    function injectModalList() {
        document.getElementById("showsettingsbutton").onclick= (e) => Observables.menu="settings";
        document.getElementById("showlogsbutton").onclick= (e) => Observables.menu="logs";
        Observables.subscribe("menu", (oldmenu, newmenu) => {
            Close(oldmenu);
            Open(newmenu);
            document.getElementById("menuselect").value = newmenu;
        });
        
        RemoveSettings.AddSelect("menuselect", "menu", "AddOn: ", [["None",""]]);
    }
    
    function registerWithSelect(modalname, modal){
        let stub = document.getElementById("menuselect");
        stub.add(new Option(modalname, modal));
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
