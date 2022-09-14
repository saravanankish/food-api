import express, { Router } from "express"
import passport from "passport"
import { getAllOrders, getOrderById, placeOrder, updateOrderStatus } from "../service/orders.service"

const router: Router = express.Router()

router.use(passport.authenticate("jwt", { session: false }))

router.get("/", getAllOrders)

router.get("/:orderId", getOrderById)

router.post("/", placeOrder)

router.put("/:orderId", updateOrderStatus)

export default router