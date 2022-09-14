import BSON from "bson"
import { Request, Response } from "express"
import log from "../logger"
import addressQuery from "../query/address"
import ordersQuery from "../query/orders"
import userQuery from "../query/user"
import { ItemQuantity, Orders, User, VariantOptions } from "../types"
import PaymentType, { OrderStatus } from "../types/enum"
import ApiError from "../utils/ApiError"
import catchError from "../utils/catchError"
import createAction from "../utils/createAction"
import { queryWithArgs } from "../utils/dbHelper"
import { itemExists, validateOptionsSelected } from "../utils/validateOrder"
import { createItemQuantity } from "./itemQuantity.service"
import moment from "moment"
import config from "config"

export const getAllOrders = catchError(async (req: Request, res: Response) => {

    const minDateReq: any = req.query.minDate
    const maxDateReq: any = req.query.maxDate
    const paymentType: any = req.query.paymentType
    const orderStatus: any = req.query.orderStatus

    let minDate = config.get("minDate") as string
    let maxDate = new Date()

    if (minDateReq) minDate = minDateReq
    if (maxDateReq) maxDate = maxDateReq

    const minDateQuery: string = moment(minDate).set("hour", 0).set("minute", 0).format("YYYY-MM-DD HH:mm:ss")
    const maxDateQuery: string = moment(maxDate).set("hour", 23).set("minute", 59).format("YYYY-MM-DD HH:mm:ss")

    let query: string = ordersQuery.getAllOrders
    let queryData: Array<string> = [minDateQuery, maxDateQuery]
    if (paymentType) {
        query += " AND paymentType=?"
        if (Number(paymentType)) {
            queryData.push(paymentType)
        } else {
            queryData.push(PaymentType[paymentType.toUpperCase()])
        }
    }
    if (orderStatus) {
        query += " AND orderStatus=?"
        if (Number(orderStatus)) {
            queryData.push(orderStatus)
        } else {
            queryData.push(OrderStatus[orderStatus.toUpperCase()])
        }
    }

    const orders: Array<Orders> = await getOrder(query, queryData)

    res.status(200).send(orders)
})

export const getOrderById = catchError(async (req: Request, res: Response) => {
    const orderId: string = req.params.orderId

    const order = await getOrder(ordersQuery.getOrderById, [orderId])

    if (!order.length || !order) {
        throw new ApiError(404, `Order with id ${orderId} not found`)
    }

    res.status(200).send(order[0])
})

export const placeOrder = catchError(async (req: Request, res: Response): Promise<void> => {
    const order: Orders = req.body
    const user: User = req.user as User
    order.orderId = new BSON.ObjectID().toString()

    if (!order.items || !order.items.length)
        throw new ApiError(400, "Products list cannot be empty")

    const customer = await queryWithArgs(userQuery.getUserById, [order.customerId])
    if (!customer.length)
        throw new ApiError(404, `User with id ${order.customerId} not found`)

    const customerAddress = await queryWithArgs(addressQuery.getAddressByUserId, [order.customerId])
    if (!customerAddress.length)
        throw new ApiError(400, "No delivery address found")

    order.deliveryAddress = customerAddress[0].id

    let total = 0
    let items: Array<ItemQuantity> = order.items
    for (let i = 0; i < items.length; i++) {
        const options: Array<VariantOptions> = await validateOptionsSelected(items[i].optionSelected || [], items[i].itemId)
        options.forEach(option => {
            total += (option.price * items[i].quantity)
        })
    }
    items = await itemExists(items)

    items.forEach(item => {
        total += (item.quantity * (item.item?.price || 0))
    })

    order.total = total
    order.orderStatus = OrderStatus.PLACED

    const orderPlacedResult = await queryWithArgs(ordersQuery.placeOrder, [order.orderId, order.customerId, order.total, order.orderStatus, order.paymentType, order.deliveryAddress])

    if (orderPlacedResult.affectedRows === 1) {
        await createItemQuantity(order.items, order.orderId)
        createAction([user.userId || null, "Order placed", order.orderId, null, null])
        log.info("Order placed successfully")
        res.status(201).send({ success: true, message: "Placed order successfully" })
    } else {
        throw new ApiError(500, "Cannot place order")
    }

})

export const updateOrderStatus = () => {
    
}

const getOrder = async (query: string, data: Array<string>): Promise<Array<Orders>> => {
    let orders: Array<Orders> = await queryWithArgs(query, data)
    const orderPromise: any = orders.map(async (order: Orders) => {
        order.paymentType = PaymentType[order.paymentType]
        order.orderStatus = OrderStatus[order.orderStatus]

        const deliveryAddressRes = await queryWithArgs(addressQuery.getAddressById, [order.deliveryAddress as number])
        order.deliveryAddress = deliveryAddressRes[0]

        const itemAndOptionsResult = await queryWithArgs(ordersQuery.getOrderItemAndOptions, [order.orderId])
        if (itemAndOptionsResult.length) {
            itemAndOptionsResult.map((item: any) => {
                item.options = item.options.split("||").map((data: any) => JSON.parse(data))
                item.totalPrice = item.optionPrice + item.price
                return item
            })
            order.items = itemAndOptionsResult
        }
        return order
    })
    orders = await Promise.all(orderPromise)
    return orders
}