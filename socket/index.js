const { Server } = require('socket.io');
const socketAuth = require('../middleware/socketAuth');
const registerLocationHandlers = require('./handlers/locationsHandler');

function createSocketServer(httpServer, corsOptions){
    // Attach Socket.IO with proper CORS configuration
    const io = new Server(httpServer, { cors: corsOptions });

    io.use(socketAuth)

    io.on('connection', (socket) => {
        registerLocationHandlers(io, socket);
    });

    console.log("We're Connected!")

    return io;
}

module.exports = createSocketServer