import { getUser, removeUser } from "../models/user.model.js"
import { createStage } from "../models/stage.model.js";
import { CLIENT_VERSION } from "../constants.js";
import handlerMappings from "./handlerMapping.js";

export const handleDisconnect = (socket, uuid) => {
    // users 배열에서 user 삭제 함수
    removeUser(socket.id);
    console.log(`User disconnected: ${socket.id}`);
    console.log('Current users:', getUser());
}

export const handleConnection = (socket, uuid) => {
    console.log(`New user connected!: ${uuid} with socket ID ${socket.id}`);
    console.log('Current Users: ', getUser())
    createStage(uuid);
    socket.emit('connection', { uuid })
}

export const handlerEvent = (io, socket, data) => {
    // 서버로부터 전달받은 데이터중 clientVersion이 일치하지 않는다면 클라이언트에게 fail 보내기
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { status: 'fail', message: "Client version mismatch" })
        return;
    }

    const handler = handlerMappings[data.handlerId]; // 클라이언트로부터 전달받은 handlerId값 담기

    // handlerId값이 존재하지 않는다면 클라이언트에게 fail 보내기
    if (!handler) {
        socket.emit('response', { status: 'fail', message: 'Handler not found' })
        return;
    }

    // 클라이언트로 전달받은 userid와 payload를 인자로 받아handlerId값의 담긴 함수를 호출
    const response = handler(data.userId, data.payload);

    // 만약 해당 함수에 return값이 status가 아닌 brdadcast라면 클라이언트 전체에게 전달
    if (response.brdadcast) {
        io.emit('response', 'broadcast');
        return;
    }

    // 클라이언트에게 response라는 이벤트로 호출한 함수를 전달
    socket.emit('response', response)
}