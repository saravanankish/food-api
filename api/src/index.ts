import express, { Application } from "express"
import cors from "cors"
import config from "config"
import log from "./logger"
import passport from "passport"
import mainController from "./controller/main.controller"
import { errorHandler, uriNotFoundHandler } from "./utils/errorHandler"
import initPassport from "./middleware/passport"
import initSchema from "./utils/schemaInit"

const app: Application = express()

app.use(express.json())
app.use(cors())
app.use(passport.initialize())
initPassport()


app.use("/", mainController);

app.use(uriNotFoundHandler)
app.use(errorHandler)

const port: number = config.get("port")
const host: string = config.get("host")

app.listen(port, host, (): void => {
    initSchema()
    log.info(`Server listening at http://${host}:${port}`)
})