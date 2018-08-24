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

    var li = jQuery('<li></li>')
    li.text(`${message.from}: ${message.text}`)

    jQuery('#messages').append( li );
});

socket.on('newLocationMessage', function ( message ) {
    var li = jQuery('<li></li>')
    var a = jQuery('<a target="_blank">Get my Current Location</a>');
    li.text(`${message.from}: `)
    a.attr('href', message.url);

    li.append( a );

    jQuery('#messages').append( li );

});


// Listen on the input Field which is setup in the HTML
jQuery('#message-form').on('submit', function ( e ) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function () {

    })
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function ( e ) {
    // Checks if Location API can be uses
    if ( !navigator.geolocation ) {
        return alert('Gelocation not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition(function ( position ) {
       console.log( position );
       socket.emit('createLocationMessage', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       });
    }, function ( error ) {
        alert('Unable to fetch Location', error);
    })
});
