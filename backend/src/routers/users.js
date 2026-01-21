import { Router } from "express";
import userControllar from "../controllars/users.js";
import validation from "../middleware/validation.js";
import checkToken from "../middleware/checkToken.js";

const router = Router()
router 
    .get("/api/users", userControllar.getAllUsers)
    .post("/api/register", validation.register, userControllar.register)
    .post("/api/login", validation.login, userControllar.login)
    .delete("/api/users", checkToken,userControllar.UserDelete)

export default router
