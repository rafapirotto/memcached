const net = require("net");

const PORT = 1337;
const IP = "0.0.0.0";

const server = net.createServer((socket) => {
    socket.write("Echo server\r\n");
    socket.on("data", (data) => {
        socket.write(data);
    });

    socket.on("close", (data) => {
        console.log(
            `Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`
        );
    });
});

server.on("error", (err) => {
    throw err;
});

server.on("connection", (socket) => {
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
