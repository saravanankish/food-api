import schemaQuery from "../query/schema/index"
import pool from "../db"
import { MysqlError } from "mysql"
import log from "../logger"

const initSchema = async (): Promise<void> => {

    const createAllSchema: string = schemaQuery.createUserSchema
        + schemaQuery.createAddressSchema
        + schemaQuery.createItemsSchema
        + schemaQuery.createItemImagesSchema
        + schemaQuery.createVariantsSchema
        + schemaQuery.createVariantOptionsSchema
        + schemaQuery.createItemVariantsMappingSchema
        + schemaQuery.creatOrdersSchema
        + schemaQuery.createItemQuantityMapperSchema
        + schemaQuery.createOptionsSelectedSchema
        + schemaQuery.createActionsSchema

    pool.query(createAllSchema, (err: MysqlError | null): any => {
        if (err) throw err
        log.info("Created all tables if not exists")
    })
}

export default initSchema