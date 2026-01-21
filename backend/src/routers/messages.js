import { Router } from "express";
import MessageControllar from "../controllars/messages.js";
import validation from "../middleware/validation.js";
import checkToken from "../middleware/checkToken.js";

const router = Router()
router 
    .get("/api/messages/:userIdTo", checkToken,MessageControllar.getAllMessages)
    .post("/api/messages/:userIdTo",checkToken ,MessageControllar.createMessage)

export default router
