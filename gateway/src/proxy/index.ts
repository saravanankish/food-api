import express, { Router } from "express"
import config from "config"
import proxy from "express-http-proxy";

const router: Router = express.Router()

const otherServiceHost: string = config.get("otherServiceHost")

router.use("/auth", proxy(`${otherServiceHost}:8001`))
router.use("/", proxy(`${otherServiceHost}:8002`))

export default router