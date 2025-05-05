const socket = io();

const nameInput = document.getElementById('name');
const msgArea = document.getElementById('msg-area');
const status = document.getElementById('status');
const message = document.getElementById('msg-here');
const msgInput = document.getElementById('msg-input');
const presence = document.getElementById('presence');

let name = '';

function join(){
    console.log('i am join  and i am working')
    name = nameInput.value.trim();
    if(!name){
        return alert('Enter a name atleast!')
    }
    socket.emit('set-name',name);

    msgArea.style.display = 'block';
}

socket.on('join',(name)=>{
    showPresence(`${name} joined`)
});

msgInput.addEventListener("input",()=>{
    if(name) socket.emit('typing',name);
});

socket.on("typing",(user)=>{
    status.innerHTML = `${user} is typing...`;
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(()=>{
        status.innerHTML = '';;
    })
});

socket.on('left',(user)=>{
    showPresence(`${user} left`);
});

socket.on('chat-msg',({from,text})=>{
    showMsg(`${from} : ${text}`);
})

function send(){
    let msg = msgInput.value.trim();
    if(!msg) return alert('Type a message atleast');
    socket.emit('chat-msg',msg);
    msgInput.value = ''
}

function showPresence(presenceStatus){
    presence.innerHTML = presenceStatus;
}

function showMsg(msg){
    const li = document.createElement('li');
    li.innerText = msg;
    message.appendChild(li);
}


