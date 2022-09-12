import { Request, Response } from "express"
import { ErrorResponse } from "../types"
import log from "../logger"
import ApiError from "./ApiError"

export const errorHandler = (err: ApiError | TypeError, _: Request, res: Response) => {
    const response: ErrorResponse = {
        status: 0,
        message: ""
    }
    response.message = err.message
    if (err instanceof ApiError)
        response.status = err.statusCode
    else
        response.status = 400
    log.error("Error occured with status code %d, message: %s, trace: %s", response.status, response.message, err.stack)
    response.stack = err.stack
    res.status(response.status).send(response)
}

export const uriNotFoundHandler = (req: Request, res: Response) => {
    log.warn("Unkown URI '%s' was accessed", req.path)
    res.status(404);
    res.json({ msg: 'Uri Not found' });
}