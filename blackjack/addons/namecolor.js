/* global sendPart, options */

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
    let color = calcColor(name);
    usernames.push({name: name, color: color});
}

function recolorName() {
    let namePart = sendPart.getElementById("name");
    let name = namePart.value;
    let colorHex = calcColor(name);
    let color = PostColor({'color': colorHex});

    namePart.style.color = "#" + color;
}

function calcColor(name) {
    if (calcColor.map === undefined) {
        calcColor.map = {};
    }
    if (calcColor.map[name] !== undefined) {
        return calcColor.map[name];
    }

    let comp = function (a) {
        let hash = md5(a + name + a);
        function byteS(i) {
            return hash.slice(2 * (i), 2 * (i + 1));
        }
        let subint = byteS(12) + byteS(13) + byteS(14) + byteS(15);
        return (parseInt(subint, 16) & 0x0FFFFFFF) % 156 + 100;
    };

    let color = (comp('a') << 16) | (comp('b') << 8) | (comp('c'));

    calcColor.map[name] = color.toString(16);

    return calcColor.map[name];
}

function ModifyNameInput() {
    const innerHTML = `
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
    
    ppart.parentNode.replaceChild(elem, ppart);
    
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

function ToggleDropdown() {
    let udc =
            document.getElementById("usernamesContent");
    if (udc.style.display === "none") {
        udc.style.display = "block";
    } else {
        udc.style.display = "none";
    }
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