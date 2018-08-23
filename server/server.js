const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '../public');

// Configure Port for Heroku and local
const port = process.env.PORT || 3000;

var app = express();

// Create http Server
var server = http.createServer( app );
// Create Web Socket Server
var io = socketIO( server );

io.on('connection', ( socket ) => {
   console.log('new User connected')

    socket.on('disconnect', () => {
        console.log('User has disconnected')
    });
});


// Configure Middleware
app.use(express.static(publicPath));

server.listen( port, () => {
    console.log(`Server started on ${port}`);
});
