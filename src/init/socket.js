import { Server as SocketIO } from 'socket.io'
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
    const io = new SocketIO();
    io.attach(server); // 서버와 io 객체 연결

    registerHandler(io);
}

export default initSocket;