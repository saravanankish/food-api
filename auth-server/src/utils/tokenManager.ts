import JWT, { JwtPayload } from "jsonwebtoken"
import fs from "fs"
import ApiError from "./ApiError"

const isJwtPayload = (object: any): object is JwtPayload => {
    return 'aud' in object || 'iss' in object || 'exp' in object
}

export const generateToken = (payload: any, secretPath: string, expiresIn: string): string => {
    try {
        const secret: string = fs.readFileSync(secretPath).toString()
        const token = JWT.sign(payload, secret, { expiresIn, algorithm: "RS256", audience: payload.userId })
        return token
    } catch (err: any) {
        if (err.code === "ENOENT")
            throw new ApiError(500, "Secret key not found")
        throw err
    }
}

export const verifyToken = (token: string, secretPath: string): any => {
    try {
        if (!token || token === "") throw new ApiError(400, "Token is missing")
        const secret: string = fs.readFileSync(secretPath).toString()
        const decoded: string | JwtPayload = JWT.verify(token, secret, { algorithms: ["RS256"] })
        if (isJwtPayload(decoded))
            return decoded.aud
    } catch (err: any) {
        if (err.code === "ENOENT")
            throw new ApiError(500, "Secret key not found")
        throw err
    }
}