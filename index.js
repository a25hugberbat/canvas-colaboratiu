const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(join(__dirname, 'public')));

const usuaris = {};

io.on('connection', (socket) => {
  
  console.log('a user connected');

    socket.on('registre', (nom) => {
    usuaris[socket.id] = {
      nom: nom,
      x: 0,
      y: 0,
      color: 'hsl(' + Math.floor(Math.random() * 360) + ', 70%, 50%)'
    };
    io.emit('cursors', usuaris);
  });

  socket.on('cursor:move', (pos) => {
    if (usuaris[socket.id]) {
      usuaris[socket.id].x = pos.x;
      usuaris[socket.id].y = pos.y;
    }
  });

  socket.on('disconnect', () => {
    delete usuaris[socket.id];
    io.emit('cursors', usuaris);
  });
  
});

setInterval(() => {
  io.emit('cursors', usuaris);
}, 50);

server.listen(20001, () => {
  console.log('http://localhost:20001');
});
