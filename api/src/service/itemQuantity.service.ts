import BSON from "bson";
import log from "../logger";
import itemQuantityQuery from "../query/itemQuantity";
import { ItemQuantity } from "../types";
import { queryWithArgs } from "../utils/dbHelper";
import { createItemOptionSelected } from "./itemOptionSelected.service";

export const createItemQuantity = async (items: Array<ItemQuantity>, orderId: string) => {
    let totalAddedToDb = 0
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const item = items[itemIndex]
        const itemQtyId: string = new BSON.ObjectID().toString()
        const itemQuantityResult = await queryWithArgs(itemQuantityQuery.createItemQuantity, [itemQtyId, item.itemId, orderId, item.quantity])
        if (itemQuantityResult.affectedRows === 1) {
            totalAddedToDb++
        }
        if (item.optionSelected?.length)
            await createItemOptionSelected(item.optionSelected, orderId, itemQtyId)
    }
    if (totalAddedToDb === items.length) {
        log.info("Inserted %d data into item quantity table", items.length)
    } else {
        log.warn("Only %d out of %d item quantity mapping were inserted", totalAddedToDb, items.length)
    }
}