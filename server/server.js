//built in node modules
const path = require('path');
const http = require('http');
//installed modules
const express = require('express');
const socketIO = require('socket.io');
//local modules
const {generateMessage} = require('./utils/message.js')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT||3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
//register a listener for some event, and then do something when the event is triggered
io.on('connection', (socket) => {
  console.log('New Client Connected');
  //sends to single user that listens/receives the call
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  //sends to all users but the individual that listens/receives the call
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New Client Joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('Received Message From Client:', message);
    //sends to all users
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });


  socket.on('disconnect', () => {
    console.log('Client Disconnected');
  });

});


server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});
