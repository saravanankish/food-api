import { Request, Response } from "express"
import catchError from "../utils/catchError"
import { queryWithArgs, queryWithoutArgs } from "../utils/dbHelper"
import variantsQuery from "../query/variants"
import variantOptionsQuery from "../query/variantOptions"
import { User, Variants } from "../types"
import ApiError from "../utils/ApiError"
import log from "../logger"
import createAction from "../utils/createAction"
import BSON from "bson"
import { mapVariantsToItems } from "./variantItem.service"

export const getAllVariants = catchError(async (_: Request, res: Response) => {
    const results = await queryWithoutArgs(variantsQuery.getAllVariants)

    results.map((result: any) => {
        result.options = result.options.split('|').map((data: string) => JSON.parse(data))
        return result
    })

    res.status(200).send(results)
})

export const addVariants = catchError(async (req: Request, res: Response) => {
    const variants: Variants = req.body
    const user: User = req.user as User
    variants.id = new BSON.ObjectID().toString()

    const variantsResult = await queryWithArgs(variantsQuery.addVariants, [variants.id, variants.title])

    if (variantsResult.affectedRows === 1) {
        if (variants.itemId) {
            await mapVariantsToItems(variants.itemId, variants.id)
        }
        if (variants.options?.length) {
            const varOpts = variants.options.map(opt => ([opt.text, `${opt.price}`, variants.id]))
            const variantOptionResult = await queryWithArgs(variantOptionsQuery.addVariantOption, [varOpts])
            if (variantOptionResult.affectedRows === varOpts.length) {
                createAction([user.userId || null, "Added variants", null, null, variants.id])
                res.status(201).send({ success: true, message: "Successfully added variant and options" })
                log.info("Successfully added variant and options")
                return
            } else {
                createAction([user.userId || null, "Added variants", null, null, variants.id])
                res.status(201).send({ success: true, message: `Successfully added variant but only ${variantOptionResult.affectedRows} out of ${variants.options.length} were added` })
                log.info(`Successfully added variant but only ${variantOptionResult.affectedRows} out of ${variants.options.length} were added`)
                return
            }
        }
        createAction([user.userId || null, "Added variants", null, null, variants.id])
        log.info("Variant added successfully")
        res.status(201).send({ success: true, message: "Successfully add variant" })
    } else {
        throw new ApiError(500, "Cannot add variants")
    }
})

export const deleteVariant = catchError(async (req: Request, res: Response) => {
    const variantId: string = req.params.variantId

    if (!variantId) throw new ApiError(400, "Variant id is empty")

    const variantInDb = await queryWithArgs(variantsQuery.getVariantById, [variantId])

    if (!variantInDb || !variantInDb.length) throw new ApiError(404, `Variant with id ${variantId} not found`)

    const deletedVariantRes = await queryWithArgs(variantsQuery.deleteVariant, [variantId])

    if (deletedVariantRes.affectedRows === 1) {
        log.info("Deleted variant with id %s successfully", variantId)
        res.status(201).send({ success: true, message: "Deleted variant successfully" })
    } else {
        throw new ApiError(500, `Couldn't delete variant with id ${variantId}`)
    }



})