const express = require('express');
const http = require('http');
const socket = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socket(server);

const users = {};

io.on('connection', socket => {

  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }

  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);

  socket.on('disconnect', () => {
    delete users[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });

});

server.listen(3333, () => console.log('Server is runnning on port 3333'));