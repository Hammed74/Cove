const express = require('express');
const cors = require('cors');
const config = require('./config');
const healthRoute = require('./routes/health');
const http = require('http');
const createSocketServer = require('./socket');

const app = express();

app.use(cors(config.cors));
app.use(express.json());

app.use('/health', healthRoute);

const server = http.createServer(app);

createSocketServer(server, config.cors)

server.listen(config.port, () => {
    console.log(`HTTP + Socket.IO server listening on port  ${config.port}`);
});