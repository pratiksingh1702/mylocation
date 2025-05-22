const express = require('express');
const app=express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('userLocation', (data) => {
        console.log('User location received:', data);
        // Broadcast the location to all connected clients
        io.emit('reciveLocation', {id: socket.id, ...data});
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Optionally, you can remove the marker for the disconnected user
        io.emit('removeMarker', { id: socket.id });
    });
}) 


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});