/* eslint-disable no-unused-vars */
const net = require('net');
require('dotenv').config();

const store = require('../store/Store');
const Connection = require('./Connection');
const { build } = require('../domain/builder');
const ClientError = require('../domain/errors/ClientError');
const { SERVER_ERROR } = require('../domain/constants/messages');

const DEFAULT_PORT = 11211;
const DEFAULT_IP = 'localhost';
const DEFAULT_MAX_CONNECTIONS = 5;
const PORT = process.env.PORT || DEFAULT_PORT;
const IP = process.env.IP || DEFAULT_IP;
const MAX_CONNECTIONS = process.env.MAX_CONNECTIONS || DEFAULT_MAX_CONNECTIONS;

const getConcurrentConnections = (server) => {
  server.getConnections((error, count) => {
    console.log(`Concurrent connections to the server: ${count}`);
  });
};

const handleData = (data, socket) => {
  console.log('data', data);
  const connection = new Connection(socket, data);
  try {
    build(connection, store);
  } catch (error) {
    const isClientError = error instanceof ClientError;
    const message = isClientError ? error.message : SERVER_ERROR;
    connection.setExpectedData(null);
    connection.sendResponse(message);
  }
};

const start = () => {
  const server = net.createServer((socket) => {
    server.maxConnections = MAX_CONNECTIONS;
    socket.on('data', (data) => {
      handleData(data, socket);
    });
    socket.on('close', (data) => {
      console.log(`Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
      getConcurrentConnections(server);
    });
  });

  const listen = () => {
    server.listen(PORT, IP, () => {
      console.log(`Server listening at ${IP}:${PORT}`);
    });
  };

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log('Address in use, retrying in 5 seconds...');
      setTimeout(() => {
        server.close();
        listen();
      }, 5000);
    } else console.log(`Error: ${err}`);
  });

  server.on('connection', (socket) => {
    console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);
    getConcurrentConnections(server);
  });

  listen();
};

module.exports = { start };
