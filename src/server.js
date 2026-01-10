import express from "express";
import { config } from "dotenv";
import { join } from "pg";
import fileUpload from "express-fileupload";
import fs from "fs";
config()

const server = express()
server.use(express.json())



server.listen(process.env.PORT, () => console.log("Server is running..."))