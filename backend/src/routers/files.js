import { Router } from "express";
import fileControllar from "../controllars/files.js";
import validation from "../middleware/validation.js";
import checkToken from "../middleware/checkToken.js";

const router = Router()
router 
    .get("/api/files/oneUser/:id", fileControllar.getAllUserFiles)
    .get("/api/files/userfiles", checkToken,fileControllar.Userfilas)
    .get("/api/files/users", fileControllar.getAllUsers)
    .get("/api/file/download/:file_name", fileControllar.download)
    .get("/file/:file_name", fileControllar.getFile)
    .post("/api/files", checkToken,validation.filePost, fileControllar.createFile)
    .put("/api/files/:fileId", checkToken,validation.filePut, fileControllar.fileUpdate)
    .delete("/api/files/:fileId", checkToken,fileControllar.fileDelete)

export default router
