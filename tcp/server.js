/* eslint-disable no-unused-vars */
const net = require('net');
require('dotenv').config();

const store = require('../store/Store');
const Connection = require('./Connection');
const { handleErrors } = require('../domain/errors/handleErrors');
const { build } = require('../domain/builder');

const DEFAULT_PORT = 11211;
const DEFAULT_IP = 'localhost';
const DEFAULT_MAX_CONNECTIONS = 5;
const PORT = process.env.PORT || DEFAULT_PORT;
const IP = process.env.IP || DEFAULT_IP;
const MAX_CONNECTIONS = process.env.MAX_CONNECTIONS || DEFAULT_MAX_CONNECTIONS;

const start = () => {
  const server = net.createServer((socket) => {
    server.maxConnections = MAX_CONNECTIONS;
    socket.on('data', (data) => {
      const connection = new Connection(socket, data);
      const errorCallback = (message) => {
        connection.setExpectedData(null);
        connection.sendResponse(message);
      };
      handleErrors(() => { build(connection, store); }, errorCallback);
    });

    socket.on('close', (data) => {
      console.log(
        `Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`,
      );
    });
  });

  const listen = () => {
    server.listen(PORT, IP, () => {
      console.log(`Server listening at ${IP}:${PORT}`);
    });
  };

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Address in use, retrying...');
      setTimeout(() => {
        server.close();
        listen();
      }, 1000);
    } else console.log(`Error: ${err}`);
  });

  server.on('connection', (socket) => {
    console.log(
      `Client connected: ${socket.remoteAddress}:${socket.remotePort}`,
    );
    server.getConnections((error, count) => {
      console.log(`Concurrent connections to the server: ${count}`);
    });
  });

  listen();
};

module.exports = { start };
