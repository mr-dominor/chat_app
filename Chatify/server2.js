import express from "express";
import http from "http";
import {Server} from "socket.io";
import path from "path";
import { fileURLToPath } from "url";


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const userMap = new Map();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/', (req,res) => {
    res.sendFile(path.join(__dirname,'/public','index.html'));
});

io.on('connection',(socket) => {
    //map name with socket first
    socket.on('set-name', name=>{
        userMap.set(socket.id,name);

        socket.broadcast.emit('joining',name);
        socket.on('chat-msg',text=>{
            io.emit('chat-msg',({from:name,text}));
        });
    });
    socket.on('disconnect', () => {
        const name = userMap.get(socket.id);
        if (name) {
            socket.broadcast.emit('left', name);
            userMap.delete(socket.id);
        }
    });
});

server.listen(8000,() => console.log("listening..."))