//built in node modules
const path = require('path');
const http = require('http');
//installed modules
const express = require('express');
const socketIO = require('socket.io');
//local modules
const {generateMessage, generateLocationMessage} = require('./utils/message.js')
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT||3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));
//register a listener for some event, and then do something when the event is triggered
io.on('connection', (socket) => {
  console.log('New Client Connected');

  socket.on('createMessage', (message, callback) => {
    console.log('Received Message From Client:', message);
    //sends to all users
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    };
    //socket.leave('Room12');
    //io.emit -> io.to('room12').emit
    //socket.broadcast.emit -> socket.broadcast.to('Room12').emit
    //socket.emit

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage(`${params.name}`, 'New Client Joined'));

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat.`))
    }
    console.log('Client Disconnected');
  });

});


server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});
