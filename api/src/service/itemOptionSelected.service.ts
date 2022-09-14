import log from "../logger";
import itemQuantityQuery from "../query/itemQuantity";
import { queryWithArgs } from "../utils/dbHelper";

export const createItemOptionSelected = async (options: Array<number>, orderId: string, itemQuantityId: string) => {
    const optionSelectedData: Array<Array<string | number>> = options.map((option: number) => ([
        orderId,
        itemQuantityId,
        option
    ]))
    const optionSelectedInsertRes = await queryWithArgs(itemQuantityQuery.createOptionSelected, [optionSelectedData])
    if (optionSelectedInsertRes.affectedRows === options.length) {
        log.info("Added %d option selected mappings", options.length)
    } else {
        log.warn("Added only %d out of %d option selected mapping", optionSelectedInsertRes.affectedRows, options.length)
    }
}