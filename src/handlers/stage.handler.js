import { getGameAssets } from "../init/assets.js";
import { getStage, setStages } from "../models/stage.model.js"

// 스테이지 이동 핸들러
export const moveStagehandler = (userId, payload) => {

    let currentStages = getStage(userId); // 유저의 현재 스테이지 정보

    if (!currentStages.length) {
        return { status: 'fail', message: "No stages found for user" }
    }

    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1]; // 현재 스테이지는 스테이지 정보에서 가장 큰 아이디 값!

    // 클라이언트 vs 서버 비교
    if (currentStage.id !== payload.currentStage) {
        return { status: "fail", message: "current Stage mismatch" }
    }

    // 점수 검증 5 => 임의로 정한 오차범위
    const serverTime = Date.now();

    // targetStage 대한 검증 <- 게임에셋에 존재하는가?
    const { stages } = getGameAssets();

    if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return { status: 'fail', message: "Target stage not found" }
    }

    setStages(userId, payload.targetStage, serverTime);

    console.log(currentStages)
    return { status: 'success', message: 'Next Stage' }
}