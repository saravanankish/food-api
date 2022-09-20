import { NextFunction, Request, Response } from "express"
import query from "../query/auth/index"
import { TokenResponse, User } from "../types"
import ApiError from "../utils/ApiError"
import catchError from "../utils/catchError"
import { queryWithArgs } from "../utils/dbHelper"
import { generateToken, verifyToken } from "../utils/tokenManager"
import bcrypt from "bcrypt"

const cleanUserData = (user: any): User => {
    user = { ...user }
    delete user.password
    delete user.creationDate
    delete user.modifiedDate
    delete user.lastLogin
    user.account_active = user.account_active.lastIndexOf(1) !== -1
    user.email_verified = user.email_verified.lastIndexOf(1) !== -1
    return user as User
}

const getTokenResponse = (user: User): TokenResponse => {
    return {
        success: true,
        access_token: generateToken({ ...user }, "./certificates/private.pem", "10h"),
        refresh_token: generateToken({ userId: user.userId }, "./certificates/privateRefreshToken.pem", "1y"),
        token_type: "Bearer"
    }
}

export const login = catchError(async (req: Request, res: Response, _: NextFunction): Promise<void> => {
    const username: string = req.body.username
    const password: string = req.body.password

    if (username === "" || !username) {
        res.status(400).send({ success: false, message: "Username is empty" })
        return
    }
    if (password === "" || !password) {
        res.status(400).send({ success: false, message: "Password is empty" })
        return
    }

    let results: any = await queryWithArgs(query.selectUserByUsername, [username])
    if (results.length === 0) throw new ApiError(404, "User not found")
    if (results.length > 1) throw new ApiError(400, "More than one user is found")

    let user: User = results[0]

    const passwordMatched = bcrypt.compareSync(password, user.password)
    if (!passwordMatched) throw new ApiError(400, "Invalid password")

    user = cleanUserData(user)

    if (!user.account_active)
        throw new ApiError(400, "User deleted")

    if (!user.email_verified)
        throw new ApiError(400, "User email not verified")

    const response: TokenResponse = getTokenResponse(user)
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

    let user = results[0]

    user = cleanUserData(user)

    const response: TokenResponse = getTokenResponse(user)

    res.status(200).send(response)
})