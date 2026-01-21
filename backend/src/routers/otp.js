import {Router} from "express";
import nodemailer from "nodemailer";
import { join } from "path";
import fs from "fs";

const router = Router()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "uzbboos34@gmail.com",
        pass: "kykm zvrm taqj dhni"
    }
})

router.post('/send', async(req, res) => {
    const { email} = req.body;
    
    const otp = Math.floor(Math.random() * 1000000)
    await transporter.sendMail({
        from: '"Notification" <uzbboos34@gmail.com>',
        to:email,
        subject: "Tadiqlash kodi",
        html:  `<h2>${otp}</h2>`
    })

    const data = fs.readFileSync(join(process.cwd(), "src", "database", "otp.json"), "utf-8")
    let otps = JSON.parse(data)

    let newOtp = {
        otp,
        email,
        expire: new Date().getTime() + 120000 * 5
    }
    otps.push(newOtp)

    fs.writeFileSync(join(process.cwd(), "src", "database", "otp.json"), JSON.stringify(otps, null, 4));       


    return res.status(200).json({
        status:200,
        message:"Tadiqlash kodi yuborildi"
    })
})  

export default router;