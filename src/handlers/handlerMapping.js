import { gameEnd, gameStart } from "./game.handler.js";
import { getItemhandler } from "./item.hadler.js";
import { moveStagehandler } from "./stage.handler.js";

// 핸들러 함수 번호 모음
const handlerMappings = {
    2: gameStart,
    3: gameEnd,
    11: moveStagehandler,
    12: getItemhandler,
}

export default handlerMappings