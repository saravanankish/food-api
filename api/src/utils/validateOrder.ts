import itemsQuery from "../query/items"
import variantOptionsQuery from "../query/variantOptions"
import { ItemQuantity, VariantOptions } from "../types"
import ApiError from "./ApiError"
import { queryWithArgs } from "./dbHelper"

export const validateOptionsSelected = async (optionSelected: Array<number>, itemId: string): Promise<Array<VariantOptions>> => {
    const promiseArray: Array<Promise<VariantOptions>> = optionSelected.map(async (optionId: number) => {
        const result = await queryWithArgs(variantOptionsQuery.getItemIdOfOption, [`${optionId}`, itemId])
        if (!result.length)
            throw new ApiError(400, `Options selected for product ${itemId} are not valid`)
        return result[0]
    })
    return await Promise.all(promiseArray)
}

export const itemExists = async (items: Array<ItemQuantity>): Promise<Array<ItemQuantity>> => {
    const promiseArray: Array<Promise<ItemQuantity>> = items.map(async (item: ItemQuantity): Promise<ItemQuantity> => {
        const itemFromDb = await queryWithArgs(itemsQuery.findItemById, [item.itemId])
        if (!itemFromDb.length)
            throw new ApiError(404, `Product with id ${item.itemId} does not exists in database`)
        item.item = itemFromDb[0]
        return item
    })

    return await Promise.all(promiseArray)
}
