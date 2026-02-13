const { io } = require('socket.io-client');

const userId = process.argv[2] || 'userA'; // pass a userId arg, e.g., node test-client.js userB

const socket = io('http://localhost:3000', {
  query: { userId }
});

socket.on('connect', () => {
  console.log('connected as', userId, 'socket', socket.id);

  // Authenticate (send friends list if you want to restrict broadcast)
  socket.emit('authenticate', { userId /*, friends: ['userB'] */ }, (res) => {
    console.log('auth ack:', res);
  });

  // Send location every 2s
  setInterval(() => {
    socket.emit('location:update', {
      latitude: 40.7128 + Math.random() * 0.001,
      longitude: -74.0060 + Math.random() * 0.001,
      altitude: 10,
      accuracy: 5,
      timestamp: Date.now()
    }, (ack) => {
      console.log('location ack:', ack);
    });
  }, 2000);
});

socket.on('friend:location', (payload) => {
  console.log(userId, 'saw friend move:', payload);
});

socket.on('disconnect', (reason) => {
  console.log('disconnected:', reason);
});