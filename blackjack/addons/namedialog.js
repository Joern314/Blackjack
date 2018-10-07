/* global ChatColor */

window.addEventListener("load", OnInit_namedialog, false);

function OnInit_namedialog() {
    console.log("Starting Plugin: namedialog.js");

    injectNameDialogHTML();
    
    addFavouriteName("	 	  	    			  	    	 Jörn");
}

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

function injectNameDialogHTML() {
    const innerHTML = `
        <div id="namedialogbox" class="box">
            <p>
                <input id="namedialogclose" type="button" value="Schließen" tabindex="100"
                    onclick="OnNameDialogClose()">
    
                <input id="namedialogfavourite" type="text" value="" tabindex="101"
                    list="favouritenames"
                    oninput="OnNameDialogSuggestionInput()">
                <datalist id="favouritenames">
                </datalist>

                <input id="namedialogcolortext" type="text" value="none" size="5" tabindex="102"
                    onchange="OnNameDialogColorTextChange()">
    
                <input id="namedialogcolor" type="color"
                    onchange="OnNameDialogColorChange()"
                    oninput="OnNameDialogColorInput()">
                <input id="namedialogcolorbutton" type="button" tabindex="103" 
                    onclick="OnNameDialogColorButton()">

                <input id="namedialogclose2" type="button" value="Schließen" tabindex="104"
                    style="float:right;"
                    onclick="OnNameDialogClose()">
            </p>
        </div>
    `;

    let elem = document.createElement('div');
    elem.innerHTML = innerHTML;
    document.body.appendChild(elem);

    /*    window.addEventListener("click", function (event) {
     if (event.target.id !== "namedialogbox") {
     OnNameDialogClose();
     }
     }, false); */
}

function OnNameDialogClose() {
    let modal = document.getElementById("namedialogbox");
    modal.style.display = "none";
}

function OnNameDialogColorChange() {
    let color = document.getElementById("namedialogcolor");

    let colorHex = parseColor(color.value);
    
    setNameDialogColor(colorHex);
}

function OnNameDialogColorInput() {
    let color = document.getElementById("namedialogcolor");
    
    let colorHex = parseColor(color.value);
    
    setNameDialogColor(colorHex);
}

function OnNameDialogColorButton() {
    let namedialogcolor = document.getElementById("namedialogcolor");
    namedialogcolor.click();
}

function OnNameDialogColorTextChange() {
    let colortext = document.getElementById("namedialogcolortext");
    
    let colorHex = parseColor(colortext.value);

    setNameDialogColor(colorHex);
}

function parseColor(colorHex) {
    if(/^([0-9a-fA-F]{6})$/.test(colorHex)) {
        colorHex = "#"+colorHex;
    } else if(/^(\#[0-9a-fA-F]{6})$/.test(colorHex)) {
    } else {
        colorHex = undefined;
    }
    
    if(colorHex) {
        let red = parseInt(colorHex.slice(1,3), 16);
        let green = parseInt(colorHex.slice(3,5), 16);
        let blue = parseInt(colorHex.slice(5,7), 16);
        
        if(red < 100 || green < 100 || blue < 100) {
            colorHex = undefined;
        }
    }
    
    if(colorHex) {
        return {text: colorHex, color: colorHex};
    } else{
        return {text: "none", color:"#646464"};
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

function OnNameDialogSuggestionInput() {
    let namedialogfavourite = document.getElementById("namedialogfavourite");
    let name = document.getElementById("name");
    name.value = namedialogfavourite.value;
    name.onchange();
    name.oninput();
}