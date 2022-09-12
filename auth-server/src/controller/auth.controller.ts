import express, { Router } from "express";
import { login, regenerateToken } from "../service/auth.service"

const router: Router = express.Router();

router.post("/login", login)

router.post("/refresh-token", regenerateToken)

export default router;