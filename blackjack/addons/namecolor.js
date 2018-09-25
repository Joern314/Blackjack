window.addEventListener("load", OnInit_namecolor, false);

function OnInit_namecolor() {
    console.log("Starting Plugin: namecolor.js");

    let namePart = document.getElementById("name");
    namePart.oninput = OnNameInput;

    OnNameInput();
}

function OnNameInput() {
    let namePart = sendPart.getElementById("name");
    let name = namePart.value;
    let colorHash = calcColor(name);
    let col = PostColor({'color': colorHash});
    let colorHex = col.toString(16);

    namePart.style.color = "#" + colorHex;
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

    calcColor.map[name] = color;
    return color;
}