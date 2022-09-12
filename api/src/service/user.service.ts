import { Request, Response } from "express"
import { User } from "../types";
import catchError from "../utils/catchError"
import { queryWithArgs } from "../utils/dbHelper";
import ApiError from "../utils/ApiError"
import userQuery from "../query/user"
import log from "../logger";
import bcrypt from "bcrypt"
import config from "config"
import BSON from "bson"

export const registerUser = catchError(async (req: Request, res: Response) => {
    const user: User = req.body

    const userWithUsername: any = await queryWithArgs(userQuery.selectUserByUsername, [user.username])
    if (userWithUsername.length !== 0) {
        throw new ApiError(400, "User with this username already exists")
    }

    if (user.username.length < 6 || user.username.length > 25)
        throw new ApiError(400, "Username length should be greater than 5 and less ths 25")

    if (!user.role || (user.role !== "CUSTOMER" && user.role !== "ADMIN"))
        throw new ApiError(400, "User role is not specified or incorrect")

    user.password = bcrypt.hashSync(user.password, config.get("bcryptSalts") as number)
    user.userId = new BSON.ObjectID().toString()

    const dbResults = await queryWithArgs(userQuery.addUser, [user.userId, user.username, user.password, user.role, user.email, user.mobile_number])

    if (dbResults.affectedRows === 1) {
        log.info("User added to database")
        res.status(201).send({ success: true, message: "User added successfully" })
    } else {
        throw new ApiError(500, "Couldn't add user now, try again later")
    }

})

