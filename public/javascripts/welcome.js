window.addEventListener("load", () => {
    var socket = io();
    var id;
    socket.on("connect", () => {
        id = socket.id;
    });

    var x = document.getElementById('newPage');
    x.addEventListener("click", buttonClicked);
    function buttonClicked() {
        console.log("Button Pressed");
        socket.emit('newPage', {id: id}); 
    }
    
    socket.on("checkedPage", (newAddress) => {
        console.log(newAddress.newAddress);
        if (newAddress.newAddress == "testingHere"){
            console.log("Uh oh, something is not right");
        } else {
            window.location.replace("/canvas-" + newAddress.newAddress);
        }
        
    });
    
});