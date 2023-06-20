


var drag = 0;
// const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`;
window.addEventListener("load", () => {
    //Add this socket stuff to another js script
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    output.innerHTML = slider.value;

    slider.oninput = function() {
        // output.innerHTML = writtenTime;
        resetData(this.value);
    }
    var socket = io();
    console.log("URL: " + window.location.pathname);
    let pathString = window.location.pathname.substring(9);
    console.log("New path: " + pathString);
    var id;
    const gridSize = 28800;
    var container = document.getElementById("grid");
    /**
     * This function controls the zooming and panning abilities
     */
    const view = (() => {
        const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
        var m = matrix;             // alias 
        var scale = 1;              // current scale
        const pos = { x: 0, y: 0 }; // current position of origin
        var dirty = true;
        const API = {
          applyTo(el) {
            if (dirty) { this.update() }
            el.style.transform = `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
            // console.log(`matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`);
            // if (m[4] == 0 && m[5] == 0){
            //     // el.style.top = 0;
            //     // el.style.left = 0;
            //     // window.location.reload(false);
            // }
          },
          update() {
            if (scale > .999 && scale < 1.0001){
                m[4] = 0;
                m[5] = 0;
                pos.x = 0;
                pos.y = 0;
            } else {
                m[4] = pos.x;
                m[5] = pos.y;
            }
            dirty = false;
            m[3] = m[0] = scale;
            m[2] = m[1] = 0;
            
          },
          pan(amount) {
            if (dirty) { this.update() }
             pos.x += amount.x;
             pos.y += amount.y;
             dirty = true;
          },
          scaleAt(at, amount) { // at in screen coords
            if (dirty) { this.update() }
            if (scale * amount < 1){
                scale = 1;
                return;
            }
            scale *= amount;
            pos.x = at.x - (at.x - pos.x) * amount;
            pos.y = at.y - (at.y - pos.y) * amount;
            dirty = true;
            
          },
        };
        return API;
      })();
      /**
       * This monstrosity below has a bunch of listeners for panning and zooming
       */
      document.addEventListener("keydown", mouseEvent, {passive: false});
      document.addEventListener("keyup", mouseEvent, {passive: false});
      document.addEventListener("mousemove", mouseEvent, {passive: false});
      document.addEventListener("mousedown", mouseEvent, {passive: false});
      document.addEventListener("mouseup", mouseEvent, {passive: false});
      document.addEventListener("mouseout", mouseEvent, {passive: false});
      document.addEventListener("wheel", mouseWheelEvent, {passive: false});
      const mouse = {x: 0, y: 0, oldX: 0, oldY: 0, button: false};
      var ctrlKey = false;

      // For Panning
      function mouseEvent(event) {
          if (event.type === "keydown"){
            ctrlKey = event.ctrlKey;
            console.log(ctrlKey);
            let divCover = document.createElement("div");
            divCover.innerHTML = "";
            divCover.className = "cover";
            divCover.draggable = false;
            divCover.setAttribute('id',"cover");
            document.getElementById("testCover").appendChild(divCover);
          }
          if (event.type === "keyup"){
            ctrlKey = event.ctrlKey;
            console.log(ctrlKey);
            removeAllChildNodes(document.getElementById("testCover"));
          }
          if (event.type === "mousedown" && ctrlKey) { mouse.button = true }
          if (event.type === "mouseup" || event.type === "mouseout" || !ctrlKey) { mouse.button = false }
          mouse.oldX = mouse.x;
          mouse.oldY = mouse.y;
          mouse.x = event.pageX;
          mouse.y = event.pageY;
          if(mouse.button) { // pan
            view.pan({x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY});
            view.applyTo(container);
          }
        //   event.preventDefault();
      }
      //For zooming
      function mouseWheelEvent(event) {
          const x = event.pageX - (container.offsetWidth / 2);
          const y = event.pageY - (container.offsetHeight / 2);
        // const x = event.clientX / 2;
        // const y = event.clientY / 2;
          if (event.deltaY < 0) { 
              view.scaleAt({x, y}, 1.1);
              view.applyTo(container);
          } else { 
              view.scaleAt({x, y}, 1 / 1.1);
              view.applyTo(container);
          }
          event.preventDefault();
      }
      function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    window.addEventListener("dragstart", (e) => {
        e.preventDefault();
    })
    window.addEventListener('drop', (e) => {
        e.preventDefault();
    })


    var data = [];

    for (let index = 0; index < gridSize; index++) {
        data.push(index);
    }
   
    

    /**
     * Below is for creating each cell
     * Each cell has a click, mousedown, and mouseover listener
     * the click and mousedown listener have the same function
     */
    let counter = 0;
    for (let j of data) {
        let cell = document.createElement("div");
        cell.innerHTML = "";
        cell.style.backgroundColor = "#FFFFFF"
        cell.className = "cell";
        cell.draggable = false;
        cell.setAttribute('id',counter);
        container.appendChild(cell);
        counter++;
    }

    /**
     * Updates data using socket.io
     */
    // socket.on('tileRecieved' + clientID, function(data) {
    //     console.log("Bruh");
    //     unconfirmedData[data.time] = 0;
    // });
    // console.log(window.location.pathname.substring(1));
    // socket.on('updateTile' + pathString, function(data) {
    //     let cell = document.getElementById(data.tileID);
    //     cell.style.backgroundColor = '#' + data.color;
    // });
    // var allData;
    var fullArr = [];
    socket.on("connect", () => {
        id = socket.id;
        console.log("Client ID: " + id);
        socket.emit('history', {url: pathString, userID: id});
        socket.on('fullHistory', function(newGridData) {
            newGridData.result.forEach(obj => {
                let valueToPush = new Array();
                Object.entries(obj).forEach(([key, value]) => {
                    
                    if (key == 'tile'){
                        valueToPush[0] = value;
                    } else if (key == 'color'){
                        valueToPush[1] = value;
                    } else if (key == 'id'){
                        valueToPush[2] = value;
                    } else if (key == 'time'){
                        valueToPush[3] = value;
                    }
                });
                fullArr.push(valueToPush);
            });
            resetData(0);
            // iterationView();
        });
    });
    var lastID = 0;
    async function resetData(toID){
        if (toID == 0){
            toID = fullArr.length;
            slider.max = fullArr.length;
            slider.value = fullArr.length;
            // slider.max = fullArr.length;
            // slider.value = 0;
        }
        // let tempArr = [];
        // tempArr = fullArr.splice(0, toID);
        if (lastID > toID) {
            for (let index = 0; index < gridSize; index++) {
                let tempCell = document.getElementById(index);
                if (tempCell.style.backgroundColor != "#FFFFFF"){
                    tempCell.style.backgroundColor = "#FFFFFF";
                }
            }
        }
        for (let index = 0; index < toID; index++) {
            const element = fullArr[index];
            let cell = document.getElementById(element[0]);
            if ((element[0] <= gridSize) && cell.style.backgroundColor != '#' + element[1]){
                // console.log(tiles2[5]);    
                cell.style.backgroundColor = '#' + element[1];
            }
        }
        lastID = toID;
        var t = fullArr[toID - 1][3].split(/[- :T.]/);
        var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
        output.innerHTML = d.toLocaleString();
    }
    async function iterationView(){
        for (let index = 1; index < slider.max; index++) {
            await resetData(index);
            await new Promise(r => setTimeout(r, 50));
        }
    }
});