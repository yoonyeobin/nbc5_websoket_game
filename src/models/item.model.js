// key: uuid, value: array -> stage 정보는 배열
const items = {};

// 아이템 초기화
export const createItem = (uuid) => {
    items[uuid] = [];
}

// 아이템 조회
export const getItems = (uuid) => {
    return items[uuid];
}

// 아이템 추가
export const setItems = (uuid, item) => {
    if (!items[uuid]) {
        items[uuid] = []; // uuid에 해당하는 항목이 없으면 배열 생성
    }
    return items[uuid].push(item);
}
