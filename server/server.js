const express = require('express');
const http = require('http');

const app = express();
const clientPath = `${__dirname}/../client/`;

app.use(express.static(clientPath))
const server = http.createServer(app);
const port = 8080;

const io = require('socket.io')(server);

server.listen(port, () =>{
    console.log("server running on "+port);
})
let users = []
let counter = 0;
io.on('connection', (socket) => {
    counter++;
    console.log(counter+' someone connected');
    socket.on('sendToAll', function(data){
        console.log(data)

        socket.broadcast.emit("displayMessage", {message:data.message, sender:data.sender});
        sender = "you"
        socket.emit("displayMessage", {message:data.message, sender:"you"})
    });

    socket.on('sendToMe', (message) =>{
        socket.emit("displayMessage", (message));
    });

    socket.on('authenticateMe', (user)=>{
        check = users.filter((el)=>{
                if( el.username === user.username &&
                    el.password === user.password){
                    return el;
                }
                return false;
        })
        users.push(user)
        console.log(user.username+" joined")
        console.log(check)

        // todo security check ...
        socket.emit('authenticate', true)
    })
})

