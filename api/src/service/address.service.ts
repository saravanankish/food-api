import log from "../logger"
import addressQuery from "../query/address"
import { Address, User } from "../types"
import ApiError from "../utils/ApiError"
import catchError from "../utils/catchError"
import { queryWithArgs } from "../utils/dbHelper"
import { Request, Response } from "express"

export const addAddress = catchError(async (req: Request, res: Response): Promise<void> => {
    const address: Address = req.body

    const result = await queryWithArgs(addressQuery.addAddress, [
        address.door_no,
        address.street,
        address.area,
        address.city,
        address.state,
        address.pincode,
        address.contact_number,
        address.landmark ? address.landmark : null,
        address.userId
    ])

    if (result.affectedRows === 1) {
        log.info("Address for user with id %s added successfully", address.userId)
        res.status(201).send({ success: true, message: "Address added successfully" })
    } else {
        throw new ApiError(500, "Couldn't add address")
    }
})

export const getAddress = catchError(async (req: Request, res: Response): Promise<void> => {
    const reqUser: User = req.user as User
    const results = await queryWithArgs(addressQuery.getAddressByUserId, [reqUser.userId as string])
    if (results.length === 0) {
        log.warn("Address of user with id %s was not found", reqUser.userId)
        res.status(404).send({ success: false, message: "Address of user not found" })
        return
    }
    log.info("Address of user with id %s was returned", reqUser.userId)
    res.status(200).send(results[0])
})


export const updateAddress = catchError(async (req: Request, res: Response): Promise<void> => {
    const address: Address = req.body
    const addressId: string = req.params.addressId

    if (!addressId) throw new ApiError(400, "Address id is empty")

    const existsResult = await queryWithArgs(addressQuery.getAddressById, [addressId])

    if (existsResult.length === 0) throw new ApiError(404, `Address with id ${addressId} not found`)

    const result = await queryWithArgs(addressQuery.updateAddress, [
        address.door_no,
        address.street,
        address.area,
        address.city,
        address.state,
        address.pincode,
        address.contact_number,
        address.landmark ? address.landmark : null,
        address.userId,
        addressId ? addressId : ""
    ])

    if (result.affectedRows === 1) {
        log.info("Address for user with id %s updated successfully", address.userId)
        res.status(201).send({ success: true, message: "Address updated successfully" })
    } else {
        throw new ApiError(500, "Couldn't update address")
    }
})