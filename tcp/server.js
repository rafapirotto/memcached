/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
const net = require('net');
const { v4: uuidv4 } = require('uuid');

const Connection = require('./Connection');
const { handleErrors } = require('../domain/errors/Handler');
const { build } = require('../domain/Builder');

// TODO: move to .env file
const PORT = 1337;
const IP = '0.0.0.0';
const MAX_CONNECTIONS = 5;
//
const start = () => {
  const server = net.createServer((socket) => {
    server.maxConnections = MAX_CONNECTIONS;
    socket.on('data', (data) => {
      const connection = new Connection(socket, data);
      const errorCallback = (message) => {
        socket.expectedData = null;
        connection.sendResponse(message);
      };
      handleErrors(() => { build(connection); }, errorCallback);
    });

    socket.on('close', (data) => {
      console.log(
        `Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`,
      );
    });
  });

  server.on('error', (err) => {
    console.log(`Error: ${err}`);
  });

  server.on('connection', (socket) => {
    socket.id = uuidv4();
    socket.waitingForData = false;
    console.log(
      `Client connected: ${socket.remoteAddress}:${socket.remotePort}`,
    );
    server.getConnections((error, count) => {
      console.log(`Concurrent connections to the server: ${count}`);
    });
  });

  server.listen(PORT, IP, () => {
    console.log(`Server listening at ${IP}:${PORT}`);
  });
};

module.exports = { start };
