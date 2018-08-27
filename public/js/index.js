var socket = io();

function scrollToBottom () {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    // Get template which is created with moustache.js
    var template = jQuery('#message-template').html();

    // Render in HTML
    var html= Mustache.render( template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    // Appends it to the html
    jQuery('#messages').append( html );
    scrollToBottom();

});

socket.on('newLocationMessage', function ( message ) {
    var formattedTime = moment(message.createdAt).format('h:mm a');

    // Get template which is created with moustache.js
    var template = jQuery('#location-message-template').html();

    // Render in HTML
    var html= Mustache.render( template, {
        createdAt: formattedTime,
        from: message.from,
        url : message.url
    });

    // Appends it to the html
    jQuery('#messages').append( html );
    scrollToBottom();

});

// Jquery LISTENERS


// Listen on the input Field which is setup in the HTML
jQuery('#message-form').on('submit', function ( e ) {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]')

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val( '' );
    })
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function ( e ) {
    // Checks if Location API can be uses
    if ( !navigator.geolocation ) {
        return alert('Gelocation not supported by your browser.')
    }
    locationButton.attr('disabled', 'disabled').text('Sending location....');

    navigator.geolocation.getCurrentPosition(function ( position ) {
        locationButton.removeAttr('disabled').text('Send location');
       console.log( position );
       socket.emit('createLocationMessage', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       });
    }, function ( error ) {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch Location', error);
    })
});
