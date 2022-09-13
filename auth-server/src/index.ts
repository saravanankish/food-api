import express, { Application } from "express"
import cors from "cors"
import config from "config"
import log from "./logger"
import mainController from "./controller/auth.controller"
import initSchema from "./utils/schemaInit"
import initApp from "./utils/init"
import { errorHandler, uriNotFoundHandler } from "./utils/errorHandler"
import morgan from "morgan"
import helmet from "helmet"

const app: Application = express()

app.use(express.static("public"))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use("/", mainController)

app.use(uriNotFoundHandler)
app.use(errorHandler)

const port: number = config.get("port")
const host: string = config.get("host")

app.listen(port, host, (): void => {
    initSchema()
    initApp()
    log.info(`Server listening at http://${host}:${port}`)
})

