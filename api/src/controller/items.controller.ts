import express, { Router } from "express"
import passport from "passport"
import { auth } from "../middleware/auth"
import { addItem, deleteItem, getAllItems, updateItem } from "../service/items.service"

const router: Router = express.Router()

router.use(passport.authenticate("jwt", { session: false }))

router.get("/", getAllItems)

router.post("/", auth("ADMIN"), addItem)

router.put("/:itemId", auth("ADMIN"), updateItem)

router.delete("/:itemId", auth("ADMIN"), deleteItem)

export default router