import { CLIENT_VERSION } from './Constants.js';

// 클라이언트와 Socket.IO 연결
// 자동으로 io.emit이 실행됨 
export const socket = io('http://localhost:3000', {
    query: {
        clientVersion: CLIENT_VERSION,
    },
});

let userId = null;
socket.on('response', (data) => {
    console.log(data);
});

// socket.emit('connection', { uuid })을 통해 서버에서 전달한 uuid를 userID 값에 담는다
socket.on('connection', (data) => {
    console.log('connection: ', data);
    userId = data.uuid;
});

// http://localhost:3000로 접속하면 바로 실행되는 함수
// socket.emit을 통해 event라는 이벤트로 userId, clientVersion: CLIENT_VERSION, handlerId, payload, 값을 서버에 전달
const sendEvent = (handlerId, payload) => {
    socket.emit('event', {
        userId,
        clientVersion: CLIENT_VERSION,
        handlerId,
        payload,
    });
};

export { sendEvent };
