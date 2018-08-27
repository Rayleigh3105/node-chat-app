const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validations');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

// Configure Port for Heroku and local
const port = process.env.PORT || 3000;

var app = express();

// Create http Server
var server = http.createServer( app );
// Create Web Socket Server
var io = socketIO( server );
var users = new Users()
;

io.on('connection', ( socket ) => {
   console.log('new User connected');

   socket.on('join', ( params, callback ) => {
     if ( !isRealString(params.name) || !isRealString(params.room) ) {
         return callback('Name and room name are required');
     }

     socket.join( params.room );
     users.removeUser( socket.id );

     users.addUser( socket.id, params.name, params.room );

     io.to( params.room ).emit('updateUserList', users.getUserList( params.room ));

     // New Change for the one client
     socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'));

     // Broadcast Message for all Clients in a room  connected to Localhost:3000
     socket.broadcast.to( params.room ).emit('newMessage', generateMessage('Admin', `${params.name} has Joined`));

     callback();
   });

   socket.on('createMessage', ( newMessage, callback ) => {
       console.log( newMessage );
       io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
       callback();
   });

   socket.on('createLocationMessage', ( coords ) => {
       io.emit('newLocationMessage', generateLocationMessage( 'Admin', coords.latitude, coords.longitude ))
    });

    socket.on('disconnect', () => {
        var user = users.removeUser( socket.id );

        if ( user ) {
            io.to( user.room ).emit('updateUserList', users.getUserList( user.room ))
            io.to( user.room ).emit('newMessage', generateMessage( 'Admin', `User ${user.name} has left`))
        }
    });
});


// Configure Middleware
app.use(express.static(publicPath));

server.listen( port, () => {
    console.log(`Server started on ${port}`);
});
