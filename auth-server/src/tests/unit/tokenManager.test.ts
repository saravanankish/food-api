const ApiError = require("../../utils/ApiError")
const { generateToken, verifyToken } = require("../../utils/tokenManager")
const jwt = require("jsonwebtoken")

const decodeJwt = (token: string): any => {
    return jwt.decode(token)
}

describe("Generate token", () => {
    test("Verify that token is generated from payload and has the claims", () => {
        const token = generateToken({ userId: "1234" }, "./certificates/private.pem", "10m")
        expect(token).toBeDefined()
        const decodedJwt = decodeJwt(token)
        expect(decodedJwt.userId).toBeDefined()
        expect(decodedJwt.userId).toBe("1234")

        const expTime = decodedJwt.exp - decodedJwt.iat
        expect(expTime).toBe(600)
    })

    test("Verify that exception is throw if file name for secret is wrong", () => {
        expect(() => generateToken({ userId: "1234" }, "./certificate/private.pem", "10m")).toThrow("Secret key not found")
    })
})

describe("Verify token", () => {
    let token: any

    beforeEach(() => {
        token = generateToken({ userId: "1234" }, "./certificates/privateRefreshToken.pem", "10m")
    })

    test("Check verify token return exact audience", () => {
        const userId = verifyToken(token, "./certificates/privateRefreshToken.pem")
        expect(userId).toBe("1234")
    })

    test("Check verify token throw error if token is empty", () => {
        expect(() => verifyToken("", "./certificates/privateRefreshToken.pem")).toThrow("Token is missing")
    })

    test("Check verify token throw error if secret path not found", () => {
        expect(() => verifyToken(token, "./certificate/privateRefreshToken.pem")).toThrow("Secret key not found")
    })

})