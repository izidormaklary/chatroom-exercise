const express = require('express');
const http = require('http');

const app = express();
const clientPath = `${__dirname}/../client`;

app.use(express.static(clientPath))
const server = http.createServer(app);
const port = 8080;

const io = require('socket.io')(server);

server.listen(port, ()=>{
    console.log("server running on "+port);
})

let counter = 0;
io.on('connection', (socket) => {
    counter++;
    console.log(counter+' someone connected')
})