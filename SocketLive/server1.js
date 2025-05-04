import express from "express";
import http from "http";
import {Server} from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

//array to store all incoming users
const connectedUserArray = new Set();

app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


//connection and communication logic
io.on('connection',(socket) => {
    //printing who has joinedn 
    console.log(`connected user is ${socket.id}`);
    //push into user array
    connectedUserArray.add(socket.id);

    //notify all except user who has joined
    socket.broadcast.emit('user-joining',socket.id);
    //availing user list to all
    io.emit('user-list',Array.from(connectedUserArray));

    //disconnection
    socket.on('disconnect',()=>{
        console.log(`User disconnected:${socket.id}`);
        //deleting the info of the user from the list
        connectedUserArray.delete(socket.id);

        //notifying others of leaving shit
        socket.broadcast.emit('user-left',socket.id)
        //availing this list to everyone
        io.emit('user-list',Array.from(connectedUserArray));
    });
});

server.listen(8090,()=>{
    console.log("listening...")
})