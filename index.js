/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
const net = require('net');
const { v4: uuidv4 } = require('uuid');

const { DataExpectedError, NoDataExpectedError } = require('./domain/errors');
const Parser = require('./parser/Parser');
const CommandFactory = require('./factory/CommandFactory');
const { TERMINATOR } = require('./domain/constants');
const { DataBlock } = require('./domain/commands');
const { handleErrors } = require('./domain/errors/Handler');

const parser = new Parser();
const commandFactory = new CommandFactory();

// TODO: move to .env file
const PORT = 1337;
const IP = '0.0.0.0';
const MAX_CONNECTIONS = 5;
//

const sendResponse = (socket, text) => {
  if (text.length > 0) socket.write(`${text}${TERMINATOR}`);
  else socket.write(text);
};

const server = net.createServer((socket) => {
  server.maxConnections = MAX_CONNECTIONS;
  socket.on('data', (data) => {
    const errorCallback = (message) => {
      socket.expectedData = null;
      sendResponse(socket, message);
    };
    const callback = () => {
      const parsedRequest = parser.parse(data);
      const command = commandFactory.create(
        parsedRequest,
        socket.expectedData,
      );
      const result = command.execute();
      socket.expectedData = result.data;
      sendResponse(socket, result.response);
    };
    handleErrors(callback, errorCallback);
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
