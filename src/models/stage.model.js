// key: uuid, value: array -> stage 정보는 배열
const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
    stages[uuid] = []; // stages중 해당 uuid의 stage를 초기화 해줌
}

export const getStage = (uuid) => {
    return stages[uuid]; // stage중 해당 uuid의 stage배열을 return
}

export const setStages = (uuid, id, timestamp) => {
    return stages[uuid].push({ id, timestamp });
}
