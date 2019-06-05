/* global ChatColor, defaults */
/* global  Blackjack, Observables */

let RemoveSettings = (function () {
    const removed = []; //["notifications","favicon","links"];
    function OnInit() {
        for(let id of removed) {
            document.getElementById(id).parentNode.parentNode.style.display="none";
        }
    }
    
    function AddCheckbox(id="stub", observable="stub", label="Stub aktivieren") {
        let old = document.getElementById("old").parentNode.parentNode;
        //<li><label><input type="checkbox" id="botblock" onchange="UpdateSettings()">Sinn anzeigen</label></li>
        let node = document.createElement("li");
        node.innerHTML =
        `
        <label><input type="checkbox" id="${id}" onchange="Observables['${observable}']=this.checked;">${label}</label>
        `;
        old.parentNode.insertBefore(node,old);
    }
    function AddSelect(id="stub", observable="stub", label="Stub: ", options=[]) {
        let old = document.getElementById("old").parentNode.parentNode;
        //<li><label>Farbschema: <select id="skin" size="1" onchange="UpdateSettings()"></select></label></li>
        let node = document.createElement("li");
        let optstr = options.map(x => `<option value="${x[1]}">${x[0]}</option>`).join();
        node.innerHTML =
        `
        <label>${label}<select id="${id}" size="1" onchange="Observables['${observable}']=this.value;">${optstr}</select></label>
        `;
        old.parentNode.insertBefore(node,old);
    }
    return {
        OnInit: OnInit,
        AddCheckbox: AddCheckbox,
        AddSelect: AddSelect
    };
})();

window.addEventListener("load", function () {
    Blackjack.addAddon("addons/removesettings.js", RemoveSettings.OnInit, []);
}, false);
