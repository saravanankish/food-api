import { queryWithArgs } from "../utils/dbHelper"
import variantItemQuery from "../query/variantItem"
import log from "../logger"
import variantsQuery from "../query/variants"
import ApiError from "../utils/ApiError"
import itemsQuery from "../query/items"

export const mapVariantsToItems = async (itemId: string, variantId: string): Promise<boolean> => {

    const variantExists = await queryWithArgs(variantsQuery.getVariantById, [variantId])
    if (!variantExists)
        throw new ApiError(404, "Variant with id " + variantId + " not found")

    const itemExists = await queryWithArgs(itemsQuery.findItemById, [itemId])
    if (!itemExists)
        throw new ApiError(404, `Item with id ${itemId} not found`)

    const mappingResult = await queryWithArgs(variantItemQuery.createMapping, [[[itemId, variantId]]])

    if (mappingResult.affectedRows === 1) {
        log.info("Created mapping between item with id %s and variant with id %s", itemId, variantId)
        return true
    } else {
        log.warn("Mapping between item with id %s and variant with id %s was not created", itemId, variantId)
        return false
    }
}