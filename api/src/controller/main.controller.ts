import express, { Router } from "express";
import userController from "./user.controller"
import itemController from "./items.controller"
import variantsController from "./variants.controller"

const router: Router = express.Router();

router.use("/user", userController)
router.use("/item", itemController)
router.use("/variants", variantsController)

export default router;