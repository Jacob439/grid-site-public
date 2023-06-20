// var writing = true;
//keep default writing color the same as the initial value in color box
var writingColor = '#ff0000';

window.addEventListener("load", () => {
    
    
    let container = document.getElementById("tools");

    console.log("URL: " + window.location.pathname);
    let pathString = window.location.pathname.substring(1);
    if (pathString.slice(0,7) == 'canvas-'){
        pathString = pathString.substring(7);
        console.log("New path: " + pathString);
    }
    let fullURL = window.location.origin + "/history-" + pathString;

    var historyView = document.getElementById('history');
    historyView.addEventListener("click", buttonClicked);
    function buttonClicked() {
        console.log("Button Pressed");
        window.open(fullURL, "_blank");
    }

    //Let's add some color listeners here
    let colorPicker = document.getElementById("colorPicker");
    // colorPicker.addEventListener("input", updateFirst, false);
    colorPicker.addEventListener("change", watchColorPicker, false);

    function watchColorPicker(event) {
        //console.log("Color is: " + event.target.value);
        writingColor = event.target.value;
    }
});