const User = require('./UserClass.js')
const express = require('express');
const http = require('http');

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
            users.push(user);
            socket.emit('authenticate', {success: true, user: user})
        } else {
            socket.emit('error', "username already exists");
        }

    })

    socket.on('authenticateMe', (user) => {
        console.log("in login ---------------------------")


        check = users.filter((el) => {
            if (el._username === user._username &&
                el._password === user._password) {
                return el;
            }
        })
        if (check.length === 1) {
            socket.emit('authenticate', {success: true, user: user});
            console.log(user._username + " joined")
        } else {
            socket.emit('error', "wrong username or password");
        }
    })
})

