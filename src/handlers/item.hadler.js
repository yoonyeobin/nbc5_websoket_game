import assetsData from "../../public/assets/assets.js";
import { getItems, setItems } from "../models/item.model.js"

export const getItemhandler = (userId, payload) => {
    const { item, currentStage } = payload;
    const possessionItem = getItems(userId);

    // 스테이지에 맞는 아이템을 획득했는지
    const items = assetsData.itemUnlockData.data
    const stageItems = items.find((stage) => stage.stage_id === currentStage.id).item_ids
    const matchingItem = stageItems.find((unlockItem) => unlockItem === item.id)

    if (!matchingItem) {
        return { status: 'fail', message: 'Item cannot exist on that stage' };
    }

    setItems(userId, item);
    console.log(possessionItem)
    return { status: 'success', message: 'Get Item' }
}
