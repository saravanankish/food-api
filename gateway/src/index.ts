import express, { Application } from "express"
import config from "config"
import cors from "cors"
import log from "./logger"
import proxies from "./proxy"

const app: Application = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1", proxies)

const port: number = config.get("port")
const host: string = config.get("host")

app.listen(port, host, (): void => {
    log.info(`Server listening to http://${host}:${port}`)
})