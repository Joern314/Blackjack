window.addEventListener("load", OnInit_smallerbuttons, false);

function OnInit_smallerbuttons() {
    console.log("Starting Plugin: smallerbuttons.js");

    changeButtonSizes();
}

function changeButtonSizes() {
    let showsettingsbutton = document.getElementById("showsettingsbutton");
    let showlogsbutton = document.getElementById("showlogsbutton");
    let quote = document.getElementById("quote");
    let send = document.getElementById("send");
    
    showlogsbutton.value = "Log";   //Logs
    showsettingsbutton.value = "Ein.";  //Einstellen
    quote.value = "Quote";  //Quote
    send.value ="Send"; //Senden
}
