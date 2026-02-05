import express from "express";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import indexRouter from "./routers/index.js";
import cors from "cors";
import errorHandler from "./utils/errorHandler.js";
import nodemailer from "nodemailer";
import { Server } from "socket.io";
import JWT from "jsonwebtoken";
import http from "http";
import pool from "./database/config.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({
  path: path.join(__dirname, "../../.env")
})

const server = express()

server.use(express.json())
server.use(cors())
server.use(fileUpload())

server.use(indexRouter.userRouter)
server.use(indexRouter.fileRouter)
server.use(indexRouter.messageRouter)
server.use(indexRouter.otpRouter)

const app = http.createServer(server, {
    cors: {
        origin: "*"
    },
    transports: ["websocket", "polling"]
})
const io = new Server(app)


io.on("connection", async socket =>{
    try {
        process.socketId = socket.id
        process.io = io
        const token = socket.handshake.auth.headers
        const user = JWT.verify(token, process.env.JWT_SECRET)
    await pool.query("update users set socket_id=$1 where id=$2 returning *", [socket.id, user.id])
    } catch (error) {        
    }
})

server.use(errorHandler)

app.listen(process.env.PORT, () => console.log("Server is running..."))
