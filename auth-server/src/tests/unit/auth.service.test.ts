import { NextFunction, Request, Response } from "express"
import { login } from "../../service/auth.service"
const {
    loginRequestOne,
    userOne,
    userTwo,
    userUnverifiedEmail,
    userInActive,
    loginRequestTwo,
    loginRequestThree,
    loginRequestInvalid
} = require("../fixtures/auth.fixture")
const { queryWithArgs } = require("../../utils/dbHelper")

jest.mock("../../logger", () => { 
    const error = jest.fn()
    const info = jest.fn()
    return {
        error,
        info
    }
})

jest.mock("../../utils/dbHelper", () => {
    const queryWithArgs = jest.fn()
    const queryWithoutArgs = jest.fn()

    return {
        __esModule: true,
        queryWithArgs,
        queryWithoutArgs
    }
})
let mockResponse: Function
let responseBody: any = {}
let status: number
let request: Partial<Request> = {}
let next: Partial<NextFunction> = {}

beforeEach(() => {
    responseBody = {}
    request = {}
    status = 0
    next = jest.fn().mockImplementation()
    mockResponse = () => {
        const res: any = {};
        res.status = jest.fn().mockImplementation((statusCode: number) => {
            status = statusCode
            return res
        })
        res.send = jest.fn().mockImplementation((result: any) => {
            responseBody = result
        })
        return res;
    };
})

describe("Login test", () => {

    test("Check login throws user not found", async () => {
        queryWithArgs.mockImplementation((_: string, __: any) => Promise.resolve([]))
        request.body = loginRequestInvalid
        await login(request as Request, mockResponse() as Response, next as NextFunction)
        expect(status).toBe(404)
        expect(responseBody.message).toBe("User not found")
    })

    test("Check login throws more than one user found", async () => {
        queryWithArgs.mockImplementation((_: string, __: any) => Promise.resolve([userOne, userTwo]))
        request.body = loginRequestInvalid
        await login(request as Request, mockResponse() as Response, next as NextFunction)
        expect(status).toBe(400)
        expect(responseBody.message).toBe("More than one user is found")
    })

    test("Check login throws invalid password", async () => {
        queryWithArgs.mockImplementation((_: string, __: any) => Promise.resolve([userOne]))
        request.body = loginRequestInvalid
        await login(request as Request, mockResponse() as Response, next as NextFunction)
        expect(status).toBe(400)
        expect(responseBody.message).toBe("Invalid password")
    })

    test("Check login throws when inactive user is logging in", async () => {
        queryWithArgs.mockImplementation((_: string, __: any) => Promise.resolve([userInActive]))
        request.body = loginRequestInvalid
        await login(request as Request, mockResponse() as Response, next as NextFunction)
        expect(status).toBe(400)
        expect(responseBody.message).toBe("User deleted")
    })

    test("Check login throws when email unverified user is logging in", async () => {
        queryWithArgs.mockImplementation((_: string, __: any) => Promise.resolve([userUnverifiedEmail]))
        request.body = loginRequestInvalid
        await login(request as Request, mockResponse() as Response, next as NextFunction)
        expect(status).toBe(400)
        expect(responseBody.message).toBe("User email not verified")
    })

    test("Check login throws error when username in request is empty", async () => {
        queryWithArgs.mockImplementation((_: string, __: any) => Promise.resolve([userOne]))
        request.body = loginRequestTwo
        await login(request as Request, mockResponse() as Response, next as NextFunction)
        expect(status).toBe(400)
        expect(responseBody.success).toBeFalsy()
        expect(responseBody.message).toBe("Username is empty")
    })

    test("Check login throws error when password in request is empty", async () => {
        queryWithArgs.mockImplementation((_: string, __: any) => Promise.resolve([userOne]))
        request.body = loginRequestThree
        await login(request as Request, mockResponse() as Response, next as NextFunction)
        expect(status).toBe(400)
        expect(responseBody.success).toBeFalsy()
        expect(responseBody.message).toBe("Password is empty")
    })

    test("Check login returns access and refresh token", async () => {
        queryWithArgs.mockImplementation((_: string, __: any) => Promise.resolve([userOne]))
        request.body = loginRequestOne
        await login(request as Request, mockResponse() as Response, next as NextFunction)
        expect(responseBody.access_token).toBeDefined()
        expect(responseBody.refresh_token).toBeDefined()
        expect(status).toBe(200)
    })

})

describe("Refresh token test", () => {
    test("Check whether refresh token is generated for valid token", () => {
        
    })
})