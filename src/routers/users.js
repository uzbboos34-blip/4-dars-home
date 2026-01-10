import { Router } from "express";

const router = Router()

router 
    .post("/api/register", validation.register, userControllar.register)

export default router
