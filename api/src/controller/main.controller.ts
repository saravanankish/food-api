import express, { Router } from "express"
import userController from "./user.controller"
import itemController from "./items.controller"
import variantsController from "./variants.controller"
import orderController from "./orders.controller"

const router: Router = express.Router()

router.use("/user", userController)
router.use("/item", itemController)
router.use("/variants", variantsController)
router.use("/order", orderController)

export default router;