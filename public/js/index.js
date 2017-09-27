//this fucntion tells the page to initiate thre request from client to server to open up the web socket and keep it open
var socket = io();


socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('Message received from server:', message)
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  $('#messages').append(li);
});


$('#message-form').on('submit', function (e) {
  let messageTextbox = $('[name=message]')
  e.preventDefault();
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = $('#send-location');

locationButton.on('click', function () {
  if(!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.text('Sending...').attr('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.text('Share location').removeAttr('disabled');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.text('Share location').removeAttr('disabled');
    alert('Unable to fetch location. Location permission not granted.')
  });
});


socket.on('newLocationMessage', function (message) {
  let li = $('<li></li>');
  var a = $('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);

}/*, function () {

}*/);
