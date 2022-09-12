import mysql, { Pool, Connection } from "mysql"
import config from "config"
import log from "../logger"

const pool: Pool = mysql.createPool({
    connectionLimit: 100,
    host: config.get("dbHost") as string,
    user: config.get("dbUsername") as string,
    password: config.get("dbPassword") as string,
    database: config.get("dbName") as string
})

pool.on("acquire", (connection: Connection): void => {
    log.info("Connection %d acquired", connection.threadId)
})

pool.on("enqueue", (): void => {
    log.info("One use is waiting for connection slot")
})

pool.on("release", (connection: Connection): void => {
    log.info("Connection %d released", connection.threadId)
})

export default pool