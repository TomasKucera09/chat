=== server/index.js ===

// Jednoduchý WebSocket server pomocí socket.io a express
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.get('/', (req, res) => {
  res.send('Chat server běží.');
});

io.on('connection', (socket) => {
  console.log('Uživatel připojen:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Uživatel ${socket.id} se připojil ke skupině ${room}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Uživatel odpojen:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});
