const express = require('express');
const app=express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
const path = require('path');

const users = {};

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
 console.log('A user connected:', socket.id);

    // Send existing users' locations to the newly connected user
    socket.emit('allUsers', users);

    socket.on('userLocation', (data) => {
        // Save the user's latest location
        users[socket.id] = data;

        // Broadcast the new location to all clients
        io.emit('reciveLocation', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete users[socket.id];
        io.emit('removeMarker', { id: socket.id });
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
