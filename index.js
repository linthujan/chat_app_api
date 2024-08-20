const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require("./app");
const { verifyJWT } = require('./utils/middlewares/jwtAuth');
const port = process.env.PORT || 3000;

const http = createServer(app);
const io = new Server(http, {

});

io.use((socket, next) => {
    if (socket.recovered) {
        console.log('Recovery');
    }
    const payload = verifyJWT(socket.request, next);
    socket.
});

io.on('connection', (socket) => {
    console.log(`Socket connected : ${socket.id}`);
    console.log('headers', socket.handshake.headers);


    socket.emit('welcome', `Hello user, ${socket.id}`);

    socket.on('message', async (message, to) => {
        console.log(`message : ${message}`);

        socket.to(to).emit('message', `${socket.id} sent message :${message}`);
        // socket.broadcast.emit('message', `${socket.id} sent message :${message}`);

        console.log('Socket Data :', {
            rooms: socket.rooms,
        });
        console.log('Io Data :', {
            sockets1: io.sockets,
            sockets2: await io.fetchSockets(),
        });

    });
});

http.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

if (process.env.NODE_ENV != 'production') {
    const ngrok = require('@ngrok/ngrok');
    ngrok.connect({ addr: port, authtoken_from_env: true, domain: process.env.NGROK_DOMAIN })
        .then((listener) => console.log(`Ingress established at: ${listener.url()}`));
}