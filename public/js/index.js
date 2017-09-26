//this fucntion tells the page to initiate thre request from client to server to open up the web socket and keep it open
var socket = io();


socket.on('connect', function () {
  console.log('Connected to server');

  socket.emit('createMessage', {
    from: 'from',
    to: 'to'
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  console.log('Message received from server:', message)
});
