import express, { Router } from "express";
import userController from "./user.controller"
import itemController from "./items.controller"

const router: Router = express.Router();

router.use("/user", userController)
router.use("/item", itemController)

export default router;