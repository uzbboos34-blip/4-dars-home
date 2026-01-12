import express from "express";
import { config } from "dotenv";
import { join } from "path";
import fileUpload from "express-fileupload";
import indexRouter from "./routers/index.js";
import fs from "fs";
config()

const server = express()
server.use(express.json())
server.use(fileUpload())

server.use(indexRouter.userRouter)
server.use(indexRouter.fileRouter)

server.use((error, req, res, next)=>{
    if (error.status && error.status < 500) {
        return res.status(error.status).json({
            status:error.status,
            message:error.message,
            name:error.name
        })
    }else{
        const existText = `[${new Date().toISOString()}]--${req.method}--${req.url}--${error}\n`
        fs.appendFileSync(join(process.cwd(),"src","logs","logger.txt"),existText)
        return res.status(500).json({
            status:500,
            message:"InternalServerError"
        })
    }
})

server.listen(process.env.PORT, () => console.log("Server is running..."))