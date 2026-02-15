//loading express module
const express = require('express');
const cors = require('cors');
const config = require('./config');
const healthRoute = require('./routes/health');
const testRoute = require('./routes/live-test')
const http = require('http');
const createSocketServer = require('./socket');
//Creates express application instance 
const app = express();

app.use(cors(config.cors));
app.use(express.json());

app.use('/health', healthRoute);

app.use('/livetest', testRoute);



const server = http.createServer(app);

createSocketServer(server, config.cors)

server.listen(config.port, '0.0.0.0', () => {
    console.log(`HTTP + Socket.IO server listening on port  ${config.port}`);
});