import { NextFunction, Request, Response } from "express"
import { ErrorResponse } from "../types"
import ApiError from "./ApiError"
import log from "../logger"

const catchError = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(err => {
            const response: ErrorResponse = {
                status: 0,
                message: ""
            }
            response.message = err.message
            if (err instanceof ApiError)
                response.status = err.statusCode
            else
                response.status = 400
            response.stack = err.stack
            log.error("Error occured with status code %d, message: %s, trace: %s", response.status, response.message, err.stack)
            res.status(response.status).send(response)
            next(err)
        })
    }
}

export default catchError