import express from "express";
import http from "http";
import {Server} from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const users = new Map();

app.use(express.static(path.join(__dirname,'public')));

io.on('connection',(socket)=>{
    console.log(`User joined with ${socket.id}`);

    socket.on('set-name',(name)=>{
        //mapping socket id with name
        users.set(socket.id,name);
        //emitting joining notification
        socket.broadcast.emit('join',name);
        //typing track
        socket.on('typing',(name)=>{
            socket.broadcast.emit('typing',name);
        });
        //showing messages
        socket.on('chat-msg',(text)=>{
            io.emit('chat-msg',({from:name, text}));
        });
    });
    socket.on('disconnect',()=>{
        const name = users.get(socket.id);
        if(name){
            socket.broadcast.emit('left',name);
            users.delete(socket.id);
        }
    })
});

server.listen(8000,()=>console.log("listening..."));