const User = require('./UserClass.js')
const express = require('express');
const http = require('http');
// const bcrypt = require('bcrypt')

const app = express();
const clientPath = `${__dirname}/../client/`;

app.use(express.static(clientPath))
const server = http.createServer(app);
const port = 8080;

const io = require('socket.io')(server);

server.listen(port, () => {
    console.log("server running on " + port);
})
let users = [];
let counter = 0;
io.on('connection', (socket) => {
    counter++;
    console.log(counter + ' someone connected');

    socket.on('sendToAll', function (data) {
        socket.broadcast.emit("displayMessage", {message: data.message, sender: data.sender});
        sender = "you"
        socket.emit("displayMessage", {message: data.message, sender: "you"})
    });


    socket.on('sendToMe', (message) => {
        socket.emit("displayMessage", {message: message, sender: "you"});
    });

    socket.on('register', (user) => {
        check = users.filter((el) => {
            if (el._username === user._username) {
                return el;
            }
        });
        if (check.length === 0) {
            user._active = true;
            user._socketId = socket.id
            users.push(user);
            let actives = getActiveUsersButMe(user._username)
            socket.emit('authenticate', {success: true, user: user._username, active: actives});
            socket.broadcast.emit('updateActiveUsers', user._username)
        } else {
            socket.emit('error', "username already exists");
        }
    });

    socket.on('authenticateMe', (user) => {
        check = users.filter((el, i) => {
            if (el._username === user._username &&
                el._password === user._password) {
                el._active = true;
                el._socketId = socket.id;
                return el;
            }
        });
        if (check.length === 1) {
            let actives = getActiveUsersButMe(user._username)
            socket.emit('authenticate', {success: true, user: user._username, active: actives});
            socket.broadcast.emit('updateActiveUsers', user._username)
        } else {
            socket.emit('error', "wrong username or password");
        }
    });
    socket.on('disconnect', socket => {
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        setTimeout(async function deactivate() {
            await timeout(20000)
                .then(() => {
                    users.filter((el) => {
                        if (el._socketId === socket.id) {
                            console.log(el._socketId);
                            console.log(socket.id)
                            el._active = false
                        }
                    });
                });
        }, 20000);
    })
    socket.on('startPrivateWith', function (data){
        let userTo = getUserByName(data.newName);
        socket.to(userTo._socketId).emit("notificationToPrivate", data.from)
    })
    socket.on('privateReject',(data)=>{
        let userTo = getUserByName(data.userTo)
        socket.to(userTo._socketId).emit("rejectedPrivate", data.from)
    })

    socket.on('privateMessage', (data)=>{
        console.log(data.userTo)
        console.log("-----------")
        console.log(data.from)
        let userTo = getUserByName(data.userTo)
        socket.emit("displayPrivate", {message: data.message, sender: "you"})
        socket.to(userTo._socketId).emit("displayPrivate", {message: data.message, sender: data.from})
    })
    socket.on('refreshed', username => {
        let check2 = users.filter((el) => {
            if (el._username === username && el._active) {
                el._socketId = socket.id;
                return el;
            }
        });
        if (check2.length === 1) {
            let actives = getActiveUsersButMe(username);
            socket.emit('authenticate', {success: true, user: username, active: actives});
        }
    });
});
function getUserByName(username){
    const tempArr = users.filter((el)=>el._username === username);
    return tempArr[0];
}
function getActiveUsersButMe(username) {
    let otherActives = users.filter((el) => el._active && el._username !== username)
    let activeUserNames = [];
    otherActives.forEach(el => {
        activeUserNames.push(el._username);
    });

    return activeUserNames;
}