const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message')

const publicPath = path.join(__dirname, '../public');

// Configure Port for Heroku and local
const port = process.env.PORT || 3000;

var app = express();

// Create http Server
var server = http.createServer( app );
// Create Web Socket Server
var io = socketIO( server );

io.on('connection', ( socket ) => {
   console.log('new User connected');

   // New Change for the one client
   socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

   // Broadcast Message for all Clients connected to Localhost:3000
   socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

   socket.on('createMessage', ( newMessage, callback ) => {
       console.log( newMessage );
       io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
       callback();
   });

   socket.on('createLocationMessage', ( coords ) => {
       io.emit('newLocationMessage', generateLocationMessage( 'Admin', coords.latitude, coords.longitude ))
    });

    socket.on('disconnect', () => {
        console.log('User has disconnected')
    });
});


// Configure Middleware
app.use(express.static(publicPath));

server.listen( port, () => {
    console.log(`Server started on ${port}`);
});
