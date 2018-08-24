var socket = io();

// Listen on connect Events
socket.on('connect', function() {
    console.log('Conected to server');
});

// Listen on disconnect Events
socket.on('disconnect', function() {
    console.log('Disconnected from server')
});

// Listen on newEmail Event
socket.on('newMessage', function ( message ) {
    console.log('Got new Message', message)
});
