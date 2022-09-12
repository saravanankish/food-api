import { queryWithArgs } from "../utils/dbHelper"
import itemImagesQuery from "../query/itemImages"

export const addItemImages = async (images: Array<string>, itemId: string): Promise<number | undefined> => {
    const itemImageSchema = images.map(img => ([img, itemId]))
    const itemImagesResult = await queryWithArgs(itemImagesQuery.addItemImages, [itemImageSchema])
    return itemImagesResult.affectedRows
}

export const deleteItemImages = async (itemId: string): Promise<number> => {
    const itemImagesResult = await queryWithArgs(itemImagesQuery.deleteItemImages, [itemId])
    return itemImagesResult.affectedRows
}

export const deleteItemImageById = async (url: string): Promise<number> => {
    const result = await queryWithArgs(itemImagesQuery.deleteItemImageByUrl, [`${url}`])
    return result.affectedRows
}