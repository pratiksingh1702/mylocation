const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server);
const path = require('path');

const users = {}; // store all user locations by socket ID

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Send existing users' locations to the new client
    socket.emit('allUsers', users);

    // Receive and broadcast location
    socket.on('userLocation', (data) => {
        users[socket.id] = data;
        io.emit('reciveLocation', { id: socket.id, ...data });
    });

    // On disconnect, remove user
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete users[socket.id];
        io.emit('removeMarker', { id: socket.id });
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
