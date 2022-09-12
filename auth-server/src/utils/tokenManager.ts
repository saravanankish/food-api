import JWT, { JwtPayload } from "jsonwebtoken"
import fs from "fs"

const isJwtPayload = (object: any): object is JwtPayload => {
    return 'aud' in object || 'iss' in object || 'exp' in object
}

export const generateToken = (payload: any, secretPath: string, expiresIn: string): string => {
    const secret: string = fs.readFileSync(secretPath).toString()
    const token = JWT.sign(payload, secret, { expiresIn, algorithm: "RS256", audience: payload.userId })
    return token
}

export const verifyToken = (token: string, secretPath: string): any => {
    const secret: string = fs.readFileSync(secretPath).toString()
    const decoded: string | JwtPayload = JWT.verify(token, secret, { algorithms: ["RS256"] })
    if (isJwtPayload(decoded))
        return decoded.aud
}