const net = require("net");
const { v4: uuidv4 } = require("uuid");

const Parser = require("./Parser");
const CommandFactory = require("./CommandFactory");
const { ERROR_MESSAGE } = require("./utils/messages");
const { InvalidCommandError, NoOptionsError } = require("./errors");
const { TERMINATOR } = require("./utils");

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
            const result = command.execute();
            sendResponse(socket, result);
        } catch (error) {
            if (
                error instanceof InvalidCommandError ||
                error instanceof NoOptionsError
            ) {
                sendResponse(socket, ERROR_MESSAGE);
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
    socket.write(`${text}${TERMINATOR}`);
};
