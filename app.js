const express = require("express");
const socket = require("socket.io");

const app = express(); // Initialization and server ready

app.use(express.static("public"));

let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
    console.log(" Listening to Port " + port);
})

let io = socket(server);

io.on("connection", (socket) => {
    console.log(" Made Socket Connection");

    //Received Data
    socket.on("startDrawing", (data) => {
        // data -> Data from FrontEnd
        // Now transfer data to all connected computers
        io.sockets.emit("startDrawing", data);
    })

    socket.on("drawStroke", (data) =>{
        io.sockets.emit("drawStroke", data);
    })

    socket.on("undoRedo", (data) => {
        io.sockets.emit("undoRedo", data);
    })
})