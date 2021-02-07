const net = require("net");

const PORT = 1337;

const server = net.createServer((socket) => {
    // 'connection' listener.
    console.log("client connected");
    socket.on("end", () => {
        console.log("client disconnected");
    });
    socket.write("server says hello\r\n");
    socket.pipe(socket);
});

server.on("error", (err) => {
    throw err;
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening in port ${PORT}`);
});
