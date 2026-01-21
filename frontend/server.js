import express from "express";
import { join } from "path";

const app = express()

app.use(express.static(join(process.cwd(), "public")))

app.get("/", (req, res) =>{
    res.sendFile(join(process.cwd(), "html","index.html"))
})
app.get("/register", (req, res) =>{
    res.sendFile(join(process.cwd(),  "html","register.html"))
})
app.get("/login", (req, res) =>{
    res.sendFile(join(process.cwd(),  "html","login.html"))
})
app.get("/admin", (req, res) =>{
    res.sendFile(join(process.cwd(),  "html","admin.html"))
})
app.get("/js/index.js", (req, res) =>{
    res.sendFile(join(process.cwd(),  "js","index.js"))
})
app.get("/index.html", (req, res) =>{
    res.sendFile(join(process.cwd(),  "html","index.html"))
})
app.get("/js/register.js", (req, res) =>{
    res.sendFile(join(process.cwd(),  "js","register.js"))
})
app.get("/js/login.js", (req, res) =>{
    res.sendFile(join(process.cwd(),  "js","login.js"))
})
app.get("/js/admin.js", (req, res) =>{
    res.sendFile(join(process.cwd(),  "js","admin.js"))
})

app.listen(9090, ()=> console.log("Front server is running..."))