import express, { Router } from "express"
import passport from "passport"
import { auth } from "../middleware/auth"
import { addVariants, getAllVariants } from "../service/variants.service"

const router: Router = express.Router()

router.use(passport.authenticate("jwt", { session: false }))

router.get("/", getAllVariants)

router.use(auth("ADMIN"))

router.post("/", addVariants)

router.put("/")

router.delete("/")

export default router