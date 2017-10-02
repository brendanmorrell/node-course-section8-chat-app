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
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      socket.broadcast.to(user.room).emit('notificationCall', generateMessage(`${user.name}`, 'triggered notificationCall on other users') )
    }

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
    let user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));

    }
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







///////IMPROVEMENT IDEAS
/*
1) Make the notification show only for people who didn't send the message
2) make the new message notification show for location sends as well
3) make the chatroom joining case insensitive
4)make it so users have to use unique namesArray
5)show a select dropdown that shows the currently active chatrooms on the index.html page
6)add something that highlights the user whose browser page it is
7) maybe add something like the "..." when people are typing, and highlight their name when typing*/
