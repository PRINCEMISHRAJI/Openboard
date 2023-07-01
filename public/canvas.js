let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width")
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let penColor = "red";
let eraserColor = "white";
let eraserWidth = eraserWidthElem.value;
let pencilWidth = pencilWidthElem.value;
let mouseDown = false;
let undoRedoTracker = [];
let tracker = undoRedoTracker.length -1;

// API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = pencilWidthElem.value;

canvas.addEventListener("mousedown", (e)=> {
    mouseDown = true;
    // startDrawing({
    //     x : e.clientX,
    //     y : e.clientY
    // });
    let data = {
        x : e.clientX,
        y : e.clientY
    }
    socket.emit("startDrawing", data);
})

canvas.addEventListener("mousemove", (e)=> {
    if(mouseDown) {
        data = {
            x : e.clientX,
            y : e.clientY,
            color : eraserFlag ? eraserColor : penColor,
            width : eraserFlag ? eraserWidth : pencilWidth
        }
        socket.emit("drawStroke", data);
    } 
    // drawStroke({    
    // })
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    tracker = undoRedoTracker.length-1;
})

function startDrawing(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e)=> {
        penColor = colorElem.classList[0];
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", (e) => {
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else {
        tool.strokeStyle = penColor;
        tool.lineWidth = pencilWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

undo.addEventListener("click", (e) => {
    if(tracker > 0) tracker--;
    let data = {
        trackValue : tracker,
        undoRedoTracker
    };
    socket.emit("undoRedo", data);
})

redo.addEventListener("click", (e) => {
    if(tracker < undoRedoTracker.length-1) tracker++;

    //track action
    let data = {
        trackValue : tracker,
        undoRedoTracker
    };

    socket.emit("undoRedo", data);
})

function undoRedoCanvas(trackObj){
    undoRedoTracker = trackObj.undoRedoTracker;
    tracker = trackObj.trackValue;

    let url = undoRedoTracker[tracker];
    let img = new Image(); // New image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

socket.on("startDrawing", (data) => {
    // data -> data from server
    startDrawing(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("undoRedo", (data) => {
    undoRedoCanvas(data);
})