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
   console.log('new User connected');

   socket.emit('newMessage', {
      from: 'Admin',
      text: 'Welcome to the chat app',
      createdAt: new Date().getTime()
   });

   socket.broadcast.emit('newMessage', {
       from: 'Admin',
       text: 'New user joined',
       createdAt: new Date().getTime()

   })

   socket.on('createMessage', ( newMessage ) => {
       io.emit('newMessage', {
           from: newMessage.from,
           text: newMessage.text,
           createdAt: new Date().getTime()
       })
       // socket.broadcast.emit('newMessage', {
       //         from: newMessage.from,
       //         text: newMessage.text,
       //         createdAt: new Date().getTime()
       //     })
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
