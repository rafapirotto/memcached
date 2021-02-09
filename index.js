const net = require("net");
const { parseArgsStringToArgv } = require("string-argv");

const PORT = 1337;
const IP = "0.0.0.0";
const MAX_CONNECTIONS = 5;
const storage = [
    { key: "test", bytes: 2, value: 25, flags: 0, exptime: 900 },
    { key: "test2", bytes: 2, value: 24, flags: 0, exptime: 900 },
    { key: "test3", bytes: 2, value: 23, flags: 0, exptime: 900 },
];
let id = 0;
const terminator = "\r\n";

const server = net.createServer((socket) => {
    server.maxConnections = MAX_CONNECTIONS;
    socket.on("data", (data) => {
        let parsedData = data.toString("utf-8");
        parsedData = parsedData.split(terminator)[0];
        const args = parseArgsStringToArgv(parsedData);
        const command = args[0];
        const options = args.slice(1);
        // Buffer.byteLength(parsedData) -> returns the number of bytes required to store a string
        switch (command) {
            case "get":
                const obj = storage.find(({ key }) => key == args[1]);
                if (obj)
                    socket.write(
                        `VALUE ${
                            args[1]
                        } ${obj.flags.toString()} ${obj.bytes.toString()}${terminator}${obj.value.toString()}${terminator}END${terminator}`
                    );
                else socket.write(`END${terminator}`);
                break;
            default:
                break;
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
    socket.id = id++;
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
