const net = require("net");
const { v4: uuidv4 } = require("uuid");

const Parser = require("./Parser");
const CommandFactory = require("./CommandFactory");
const {
    ERROR_MESSAGE,
    BAD_DATA_CHUNK,
    BAD_COMMAND_LINE_FORMAT,
} = require("./utils/messages");
const {
    InvalidCommandError,
    NoOptionsError,
    WrongArgumentNumberError,
    DataBlockExpectedError,
    NoDataBlockExpectedError,
    WrongByteLength,
    BadCommandLineFormatError,
} = require("./errors");
const { TERMINATOR } = require("./utils");
const { DataBlock } = require("./commands/index");

const parser = new Parser();
const commandFactory = new CommandFactory();

const PORT = 1337;
const IP = "0.0.0.0";
const MAX_CONNECTIONS = 5;

const server = net.createServer((socket) => {
    server.maxConnections = MAX_CONNECTIONS;
    socket.on("data", (data) => {
        try {
            const parsedRequest = parser.parse(data);
            const command = commandFactory.create(parsedRequest);
            let result = null;
            if (socket.expectedData) {
                if (command instanceof DataBlock) {
                    console.log("1");
                    result = command.execute(socket.expectedData);
                } else {
                    console.log("2");
                    throw new DataBlockExpectedError();
                }
            } else {
                if (typeof command === DataBlock) {
                    console.log("3");
                    throw new NoDataBlockExpectedError();
                } else {
                    console.log("4");
                    result = command.execute();
                }
            }
            if (result.data) socket.expectedData = result.data;
            else socket.expectedData = null;
            sendResponse(socket, result.response);
        } catch (error) {
            console.log(error.message);
            console.log(error);
            if (
                error instanceof InvalidCommandError ||
                error instanceof NoOptionsError ||
                error instanceof WrongArgumentNumberError ||
                error instanceof NoDataBlockExpectedError
            ) {
                sendResponse(socket, ERROR_MESSAGE);
            } else if (
                error instanceof DataBlockExpectedError ||
                error instanceof WrongByteLength
            ) {
                sendResponse(socket, BAD_DATA_CHUNK);
            } else if (error instanceof BadCommandLineFormatError) {
                sendResponse(socket, BAD_COMMAND_LINE_FORMAT);
            }
        }
    });

    socket.on("close", (data) => {
        console.log(
            `Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`
        );
    });
});

server.on("error", (err) => {
    console.log("Error: " + err);
});

server.on("connection", (socket) => {
    socket.id = uuidv4();
    socket.waitingForData = false;
    console.log(
        `Client connected: ${socket.remoteAddress}:${socket.remotePort}`
    );
    server.getConnections((error, count) => {
        console.log(`Concurrent connections to the server: ${count}`);
    });
});

server.listen(PORT, IP, () => {
    console.log(`Server listening at ${IP}:${PORT}`);
});

sendResponse = (socket, text) => {
    if (text.length > 0) socket.write(`${text}${TERMINATOR}`);
    else socket.write(text);
};
