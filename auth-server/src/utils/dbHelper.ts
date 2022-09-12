import { MysqlError } from "mysql";
import pool from "../db";

export const queryWithoutArgs = (query: string): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
        pool.query(query, (err: MysqlError | null, result: any): void => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

export const queryWithArgs = (query: string, data: Array<string>): Promise<any> => {
    return new Promise((resolve: any, reject: any): void => {
        pool.query(query, data, (err: MysqlError | null, result: any) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}