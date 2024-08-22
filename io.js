const { Server } = require('socket.io');
const { verifyJWT } = require('./utils/middlewares/jwtAuth');
const { User, UserChat, Chat, Message } = require('./models');

module.exports = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:3000",
                "http://localhost:5500",
                "https://tough-terminally-koala.ngrok-free.app",
            ],
        },
    });

    io.use(async (socket, next) => {
        try {
            if (socket.recovered) {
                console.log('Recovery');
            }
            const payload = verifyJWT(socket.request, next);
            const user = await User.findOne({
                where: {
                    user_id: payload.user_id,
                },
                include: [
                    {
                        model: Chat,
                        as: 'chats',
                    },
                ],
            });
            if (!user) {
                return next(new Error("Socket.IO authentication failed"));
            }
            socket.auth = user.toJSON();
            next();
        } catch (error) {
            console.log(error);
            next(new Error(error.name));
        }
    });

    io.on('connection', async (socket) => {
        joinToRooms(socket);

        const { user_id, username, chats } = socket.auth;
        socket.emit('welcome', `Hello user, ${username}`, chats);

        socket.on('join_chat', async (chat_id) => {
            try {
                const { user_id, username } = socket.auth;
                // const [userChat, isCreated] = await UserChat.findOrCreate({
                //     where: { chat_id, user_id, },
                //     defaults: { chat_id, user_id, type: 'MEMBER', },
                // });

                await socket.join(chat_id);
                socket.emit('join_chat', `Hi ${username}, welcome to chat`);
                socket.broadcast.to(chat_id).emit('join_chat', `${username} joined to chat`);
                // socket.broadcast.to(chat_id).except(user_id).emit('join_chat', `${username} joined to chat`);

            } catch (error) {
                console.log(error);
                socket.emit("join_chat_error", "Join chat failed");
            }
        });

        socket.on('send_message', async (to, message, type) => {
            try {
                const { user_id, username } = socket.auth;
                const newMessage = await Message.create({
                    user_id,
                    chat_id: to,
                    type,
                    text: message.text,
                });

                io.in(to).fetchSockets().then(sockets => {
                    console.log("Sockets in this room :");

                    sockets.forEach(socket => {
                        console.log(socket.auth.username);
                    });
                });

                const sockets = await socket.to(to).fetchSockets()
                sockets.forEach((soc, i) => {
                    console.log(`Receiver ${i + 1}`, soc.auth.username, soc.auth.user_id);
                    console.log(soc.id);
                });

                socket.to(to).emit('receive_message', {
                    newMessage,
                    from: socket.auth,
                });
            } catch (error) {
                console.log(error);
                socket.emit("send_message_error", "Send message failed");
            }
        });
    });
}

const joinToRooms = async (socket) => {
    socket.leave(socket.id);
    socket.auth.chats.forEach(chat => {
        console.log("Re-Joining Room :", chat.name, chat.chat_id, "Socket :", socket.id);
        socket.join(chat.chat_id);
    });

    console.log("Joined Rooms :");
    socket.rooms.forEach(room => {
        console.log(room);
    });

    socket.join(socket.auth.user_id);
}