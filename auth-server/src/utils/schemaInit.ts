import schemaQuery from "../query/schema/index"
import pool from "../db"
import { MysqlError } from "mysql"
import log from "../logger"

const initSchema = async (): Promise<void> => {
    pool.query(schemaQuery.createUserSchema, (err: MysqlError | null): any => {
        if (err) throw err
        log.info("Created user table if not exists")
    })
}

export default initSchema