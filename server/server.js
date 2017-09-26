//built in node modules
const path = require('path');
const http = require('http');
//installed modules
const express = require('express');
const socketIO = require('socket.io');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT||3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));
//register a listener for some event, and then do something when the event is triggered
io.on('connection', (socket) => {
  console.log('New Client Connected');

  socket.emit('newMessage', {
    from:'Admin',
    text:'Welcome to the chat app',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New User Joined',
    createdAt: new Date().getTime()
  })

  socket.on('createMessage', (message) => {
    console.log('Received Message From Client:', message);
    //sends to all users
/*    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });*/
    //sends to every user but the one that connected to the socket and sent the trigger
/*    socket.broadcast.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })*/
  });


  socket.on('disconnect', () => {
    console.log('Client Disconnected');
  });

});


server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
});
