import express, { Router } from "express"
import passport from "passport"
import { registerUser } from "../service/user.service"
import { addAddress, getAddress, updateAddress } from "../service/address.service"
import { auth } from "../middleware/auth"

const router: Router = express.Router()

router.post("/register", registerUser)

router.use(passport.authenticate("jwt", { session: false }))

router.get("/address", auth("CUSTOMER"), getAddress)

router.post("/address", auth("CUSTOMER"), addAddress)

router.put("/address/:addressId", auth("CUSTOMER"), updateAddress)

export default router