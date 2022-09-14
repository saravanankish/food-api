import express, { Router } from "express"
import passport from "passport"
import { auth } from "../middleware/auth"
import { addItem, deleteItem, getAllItems, updateItem, addVariantToItem, getItemById } from "../service/items.service"

const router: Router = express.Router()

router.use(passport.authenticate("jwt", { session: false }))

router.get("/", getAllItems)

router.get("/:itemId", getItemById)

router.use(auth("ADMIN"))

router.post("/", addItem)

router.post("/map", addVariantToItem)

router.put("/:itemId", updateItem)

router.delete("/:itemId", deleteItem)

export default router