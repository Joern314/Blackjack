/* global sendPart, options, ChatColor */

window.addEventListener("load", OnInit_namecolor, false);

let usernames = [];

function OnInit_namecolor() {
    console.log("Starting Plugin: namecolor.js");
    ModifyNameInput();
    OnNameInput();

    addUsername("Lukas");
    rebuildUsernamesDatalist();

    console.log("done starting plugin");
}

function addUsername(name) {
    let color = ChatColor.get(name);
    usernames.push({name: name, color: color});
}

function recolorName() {
    let namePart = sendPart.getElementById("name");
    let name = namePart.value;
    let colorHex = ChatColor.getWithLayout(name);
    namePart.style.color = "#" + colorHex;
}

function ModifyNameInput() {
/*    const innerHTML = `
        <label id="nameLabel" for="name">Name:</label>
    
        <div class="dropdown-div">
            <input id="name" placeholder="Name" tabindex="1">
            <div class="dropdown-content" id="usernamesContent">
                <label>Lukas</label>
                <label>Luise</label>
            </div>
        </div>
     `; 
    //        <input id="nameButton" value="Select" onclick="OnNameButtonClick()">

    // <p>
    let ppart = document.getElementById("name").parentNode;
    // replacement <div>
    let elem = document.createElement('div');
    elem.className = "dropdown-line";
    elem.innerHTML = innerHTML;
    
    ppart.parentNode.replaceChild(elem, ppart); */
    
    addCallbacks();
}

function addCallbacks() {
    let name = document.getElementById("name");
    name.onchange = OnNameChange;
    name.oninput = OnNameInput;
    name.addEventListener("keypress", function (event) {
        if (event.keyCode === 38 || event.keyCode === 40) {
            ToggleDropdown();
        }
    }, false);
}

function OnNameChange() {
//    rebuildUsernamesDatalist();
    UpdateSettings();
}

function OnNameInput() {
    recolorName();
}

function OnNameButtonClick() {
    console.log("event");

    let nameButton = document.getElementById("nameButton");
//    nameOptions.slideToggle(100);
}

function rebuildUsernamesDatalist() {
    console.log(usernames);

    let elem = document.getElementById("usernameList");
    if (elem === null) {
        return;
    }
    // clear
    for (let i = elem.options.length - 1; i >= 0; i--)
    {
        elem.remove(i);
    }
    // rebuild
    for (let i = usernames.length - 1; i >= 0; i--) {
        let name = usernames[i];
        let option = document.createElement('option');
        option.value = name['name'];

        elem.appendChild(option);
    }
}

