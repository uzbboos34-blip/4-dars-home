import { Router } from "express";
import fileControllar from "../controllars/files.js";
import validation from "../middleware/validation.js";
import checkToken from "../middleware/checkToken.js";

const router = Router()
router 
    .get("/api/files/oneUser", checkToken,fileControllar.getAllFiles)
    .get("/api/files/users", fileControllar.getAllUsers)
    .post("/api/files", checkToken,validation.filePost, fileControllar.createFile)
    .put("/api/files/:fileId", checkToken,validation.filePut, fileControllar.fileUpdate)
    .delete("/api/files/:fileId", checkToken,fileControllar.fileDelete)

export default router
