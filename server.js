const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Array of video file names
const videos = ['video1.mp4', 'video2.mp4', 'video3.mp4'];

// Current video index
let currentVideoIndex = 0;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/control', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'video-control.html'));
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('nextVideo', () => {
    // Increment the current video index
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    // Broadcast the new video index to all connected clients
    io.emit('playVideo', videos[currentVideoIndex]);
  });

  socket.on('prevVideo', () => {
    // Decrement the current video index
    currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    // Broadcast the new video index to all connected clients
    io.emit('playVideo', videos[currentVideoIndex]);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
