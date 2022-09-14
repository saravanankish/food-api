import { Request, Response } from "express";
import catchError from "../utils/catchError";
import { queryWithArgs, queryWithoutArgs } from "../utils/dbHelper";
import itemQuery from "../query/items"
import { Item, User } from "../types";
import ApiError from "../utils/ApiError";
import BSON from "bson";
import createAction from "../utils/createAction";
import log from "../logger";
import { addItemImages, deleteItemImageById } from "./itemImages.service";
import { mapVariantsToItems } from "./variantItem.service";

export const getAllItems = catchError(async (_: Request, res: Response) => {
    const results = await queryWithoutArgs(itemQuery.getAllItems)

    results.map(async (result: any) => {
        result.images = result.images.split(",")
        return result
    })
    log.info("All items were returned")
    res.status(200).send(results)
})

export const getItemById = catchError(async (req: Request, res: Response) => {
    const itemId: string = req.params.itemId

    if (!itemId) throw new ApiError(400, "Item id is empty")

    const item = await queryWithArgs(itemQuery.findItemById, [itemId])

    if (!item) throw new ApiError(404, `Item with id ${itemId} is not found`)

    res.status(200).send(item)
})


export const addItem = catchError(async (req: Request, res: Response) => {
    const items: Item = req.body

    items.itemId = new BSON.ObjectID().toString()
    const user: User = req.user as User

    const itemResult = await queryWithArgs(itemQuery.addItems,
        [[[items.itemId, items.title, items.description, items.image, `${items.price}`]]])

    if (itemResult.affectedRows === 1) {
        if (items.images?.length) {
            const affectedRows: number | undefined = await addItemImages(items.images, items.itemId)
            if (affectedRows === items.images.length) {
                res.status(201).send({ success: true, message: "Successfully added item and images" })
                log.info("Successfully added item and images")
                createAction([user.userId || null, "Created item", null, items.itemId, null])
                return
            } else {
                res.status(201).send({ success: false, message: "Item added but some of all of images were not added" })
                createAction([user.userId || null, "Created item", null, items.itemId, null])
                log.warn("Item added but some of all of images were not added")
                return
            }
        }
        createAction([user.userId || null, "Created item", null, items.itemId, null])
        log.info("Successfully added item")
        res.status(201).send({ success: true, message: "Successfully added item" })
    } else {
        throw new ApiError(500, "Couldn't add item")
    }
})

export const updateItem = catchError(async (req: Request, res: Response) => {
    const items: Item = req.body
    const itemId: string = req.params.itemId
    const user: User = req.user as User

    if (!itemId) throw new ApiError(400, "Item id is empty")

    const itemResult = await queryWithArgs(itemQuery.findItemById, [itemId])
    if (!itemResult) throw new ApiError(404, `Item with id ${itemId} is not present`)
    const updateResult = await queryWithArgs(itemQuery.updateItem, [items.title, items.description, items.image, `${items.price}`, itemId])
    if (updateResult.affectedRows === 1) {
        if (items.images?.length) {
            const previousImages: Array<string> = itemResult[0].images.split(",")
            const toAdd = items.images.filter(img => !previousImages.includes(img))
            const toDelete = previousImages.filter(img => !items.images?.includes(img))
            toDelete.forEach(item => deleteItemImageById(item))
            const affectedRows = await addItemImages(toAdd, itemId)
            if (affectedRows === toAdd.length) {
                log.info("Item and images with itemId %s updated successfully", itemId)
                res.status(201).send({ success: true, message: "Item and item images updated successfully" })
                createAction([user.userId || null, "Updated item", null, itemId, null])
                return
            } else {
                log.warn("Item with id %s updated successfully, but few images were not updated", itemId)
                res.status(201).send({ success: true, message: "Item updated but some of all of images were not updated" })
                createAction([user.userId || null, "Updated item", null, itemId, null])
                return
            }
        }
        createAction([user.userId || null, "Updated item", null, itemId, null])
        log.info("Item with id %s updated successfully", itemId)
        res.status(201).send({ success: true, message: "Updated item successfully" })
    } else {
        throw new ApiError(500, "Couldn't update item")
    }
})

export const deleteItem = catchError(async (req: Request, res: Response) => {
    const itemId: string = req.params.itemId
    const user: User = req.user as User

    if (!itemId) throw new ApiError(400, "Item id is empty")

    const itemResult = await queryWithArgs(itemQuery.findItemById, [itemId])
    if (!itemResult) throw new ApiError(404, `Item with id ${itemId} is not present`)

    const deleteResult = await queryWithArgs(itemQuery.deleteItemById, [itemId])
    if (deleteResult.affectedRows === 1) {
        log.info("Deleted item with id %s successfully", itemId)
        createAction([user.userId || null, "Deleted item", null, itemId, null])
        res.status(202).send({ success: true, message: "Deleted item successfully" })
    } else {
        throw new ApiError(500, "Cannot delete item")
    }
})

export const addVariantToItem = catchError(async (req: Request, res: Response): Promise<void> => {
    const itemId: string = req.body.itemId
    const variantId: string = req.body.variantId

    if (!itemId) throw new ApiError(400, "Item id is empty")

    if (!variantId) throw new ApiError(400, "Variant id is empty")

    const mapped: boolean = await mapVariantsToItems(itemId, variantId)
    if (mapped) {
        res.status(201).send({ success: true, message: "Mapped successfully" })
    } else {
        throw new ApiError(500, "Couldn't map variant to item")
    }
})