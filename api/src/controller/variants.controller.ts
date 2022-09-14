import express, { Router } from "express"
import passport from "passport"
import { auth } from "../middleware/auth"
import { addVariants, deleteVariant, getAllVariants } from "../service/variants.service"

const router: Router = express.Router()

router.use(passport.authenticate("jwt", { session: false }))

router.get("/", getAllVariants)

router.use(auth("ADMIN"))

router.post("/", addVariants)

router.delete("/:variantId", deleteVariant)

export default router