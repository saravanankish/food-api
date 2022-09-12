import { queryWithArgs } from "./dbHelper"
import actionQuery from "../query/actions"
import log from "../logger"

const createAction = async (data: Array<string | null>) => {
    const result = await queryWithArgs(actionQuery.createAction, data)
    if (result.affectedRows === 1) {
        log.info("Action created")
    } else {
        log.info("Action couldn't be created")
    }
}

export default createAction