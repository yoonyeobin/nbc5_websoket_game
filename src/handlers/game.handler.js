import { getGameAssets } from "../init/assets.js";  //getGameAssets : 각 assets 배열을 담고있는 객체 
import { createItem, getItems } from "../models/item.model.js";
import { createStage, getStage, setStages } from "../models/stage.model.js";

// 게임 시작 함수
export const gameStart = (uuid, payload) => {
    const { stages } = getGameAssets(); // stage에 stage.json파일 값을 담는다

    createStage(uuid); // 유저의 스테이지 초기화
    createItem(uuid); // 유저 아이템 목록 초기화

    setStages(uuid, stages.data[0].id, payload.timestamp); //user의 스테이지 정보에 스테이지 id 값과 시간 정보를 추가한다
    console.log('Stage ', getStage(uuid)); // user의 현재 스테이지 정보를 출력

    return { status: 'success' }
}

export const gameEnd = (uuid, payload) => {
    // 클라이언트는 게임 종료 시 타음스탬프와 총 점수
    const { score, endTime } = payload;
    const { stages } = getGameAssets();
    const userStages = getStage(uuid);
    const items = getItems(uuid);
    let itemScore = 0;

    console.log(userStages)

    // 아이템 총 점수 계산
    if (!items) {
        itemScore = 0;
    } else {
        itemScore = items.reduce((acc, item) => acc + item.score, 0);
    }

    if (!userStages.length) {
        return { status: 'fail', message: 'No stages found for user' };
    }

    userStages.sort((a, b) => b.id - a.id)
    console.log('dddd', userStages)

    // 각 스테이지의 지속 시간을 계산하여 총 점수 계산
    let stageTotalScore = 0;
    if (userStages.length === 1) {
        stageTotalScore = Math.floor((endTime - userStages[0].timestamp) / 1000)
    } else {
        for (let i = 0; i < userStages.length - 1; i++) {
            const stageTime = Math.floor((userStages[i].timestamp - userStages[i + 1].timestamp) / 1000)
            const scorePerSecond = stages.data.find(stage => stage.id === userStages[i].id).scorePerSecond
            const stageScore = Math.floor(stageTime * scorePerSecond)
            stageTotalScore += stageScore
        }
    }


    const totalScore = stageTotalScore + itemScore
    console.log('stage', stageTotalScore)
    console.log('item', itemScore)


    // 점수와 타임스탬프 검증
    // 오차범위 5
    if (Math.abs(score - totalScore) > 5) {
        return { status: 'fail', message: "Score verification failed" }
    }

    return { status: 'success', message: 'Game ended', score }
}


