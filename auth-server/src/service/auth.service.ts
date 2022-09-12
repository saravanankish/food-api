import { NextFunction, Request, Response } from "express"
import query from "../query/auth/index"
import { TokenResponse, User } from "../types"
import ApiError from "../utils/ApiError"
import catchError from "../utils/catchError"
import { queryWithArgs } from "../utils/dbHelper"
import { generateToken, verifyToken } from "../utils/tokenManager"
import bcrypt from "bcrypt"

const cleanUserData = (user: any): void => {
    delete user.password
    delete user.creationDate
    delete user.modifiedDate
    delete user.lastLogin
    user.account_active = user.account_active.lastIndexOf(1) !== -1
    user.email_verified = user.email_verified.lastIndexOf(1) !== -1
}

export const login = catchError(async (req: Request, res: Response, _: NextFunction): Promise<void> => {
    const username: string = req.body.username
    const password: string = req.body.password

    if (username === "" || !username) {
        res.status(400).send({ success: false, message: "Username is empty" })
    }
    if (password === "" || !password) {
        res.status(400).send({ success: false, message: "Password is empty" })
    }

    let results: any = await queryWithArgs(query.selectUserByUsername, [username])
    if (results.length === 0) throw new ApiError(404, "User not found")
    if (results.length > 1) throw new ApiError(400, "More than one user is found")

    const user: User = results[0]

    const passwordMatched = bcrypt.compareSync(password, user.password)

    console.log(passwordMatched)

    if (!passwordMatched) throw new ApiError(400, "Invalid password")

    cleanUserData(user)

    if (!user.account_active)
        throw new ApiError(400, "User deleted")

    if (!user.email_verified)
        throw new ApiError(400, "User email not verified")

    const response: TokenResponse = {
        success: true,
        access_token: generateToken({ ...user }, "./certificates/private.pem", "10h"),
        refresh_token: generateToken({ userId: user.userId }, "./certificates/privateRefreshToken.pem", "1y"),
        token_type: "Bearer"
    }
    res.status(200).send(response);
})

export const regenerateToken = catchError(async (req: Request, res: Response) => {
    const refreshToken: string | null = req.body.refreshToken

    if (!refreshToken)
        throw new ApiError(400, "Refresh token not present")

    const userId: any = verifyToken(refreshToken, "./certificates/privateRefreshToken.pem")

    let results: any = await queryWithArgs(query.selectUserByUserId, [userId])
    if (results.length === 0) throw new ApiError(404, "Invalid refresh token")
    if (results.length > 1) throw new ApiError(400, "More than one user is found")

    const user = results[0]

    cleanUserData(user)

    const response: TokenResponse = {
        success: true,
        access_token: generateToken({ ...user }, "./certificates/private.pem", "10h"),
        refresh_token: generateToken({ userId: user.userId }, "./certificates/privateRefreshToken.pem", "1y"),
        token_type: "Bearer"
    }

    res.status(200).send(response)
})