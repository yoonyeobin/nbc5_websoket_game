import express from "express";
import { createServer } from 'http'
import { loadGameAssets } from "./init/assets.js";
import initSocket from './init/socket.js'

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
initSocket(server);

// [initSocket(server);]
// io.attach(server)를 통해 서버와 io 연결  -> registerHandler(io)를 실행 

// 1. registerHandler(io) => initSocket으로 생성된 io객체를 인자로 받는 함수 
// io.on을 통해 클라이언트로부터 connection 이벤트롤 통해 데이터 수신 
// adduser 함수를 통해 users 배열에 user객체 ({ uuid: userUUID(무작위로 생성된 고유 UUID 값을 담는다), socketId: socket.id(클라이언트로부터 전받은 socket) }) 추가 

// socket, userUUID를 인자로 받는 handleConnection 함수 실행 
// 콘솔로그에 추가된 유저의 uuid와 socket id 출력 및 users 배열 출력
// createStage(uuid) 함수 실행 => stages객체의 stages[인자로 받은 uuid 값]의 stage를 초기화 함 아래와 같은 형태

// {
//     '78d6c099-3f1f-4638-ad3f-82c229bc9737': [],
//     'd48b76ed-e7f7-4a52-8309-ca31d1e24396': [],
//     'bfc18b75-15a7-46b9-ae2e-c59d6cbddd5d': []
//   }

// socket.emit('connection', { uuid })을 통해 uuid값을 클라이언트에 전달

// 다시 registerHandler로 돌아와서 socket.on('event', (data) => handlerEvent(io, socket, data));을 통해 클라이언트에게 event라는 이벤트를 통해 데이터를 전달받고
// 해당 데이터(클라이언트에서 socket.emit을 통해 event라는 이벤트로 userId, clientVersion: CLIENT_VERSION, handlerId, payload, 값을 서버에 전달)를 인자로 handlerEvent 함수 실행

// handler를 통해 handlerMappings에서 해당 함수를 찾아주고 
// response에 userid와 payload를 인자로 받아 handlerId값의 담긴 함수를 호출한 값을 담는다
// socket.emit('response', response)을통해 해당 결과 값을 클라이언트에게 전달한다

// 다시 registerHandler로 돌아와서 클라이언트에서 disconnect라는 이벤트로 전달받은 데이터가 존재한다면 
// handleDisconnect함수를 통해 users 배열에서 user를 삭제해준다.


server.listen(PORT, async () => {
    console.log(PORT, "포트로 서버가 열렸습니다.");
    try {
        const assets = await loadGameAssets();
        console.log(assets);
    } catch (e) {
        console.error('Faliled to load game assets', e);
    }
});