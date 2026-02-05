import {Router} from "express";
import nodemailer from "nodemailer";
import { join } from "path";
import fs from "fs";
import { config } from "dotenv";
config()

const router = Router()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

router.post('/send', async(req, res) => {
    const { email} = req.body;
    
    const otp = Math.floor(Math.random() * 1000000)
    await transporter.sendMail({
        from: `"MyApp Notification" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Tasdiqlash kodi | MyApp",
        html: `
        <!-- PREHEADER (OTPni inboxda yashiradi) -->
        <span style="display:none;opacity:0;color:transparent;">
            Bu avtomatik xabar, iltimos javob bermang.
        </span>

        <div style="font-family:Arial,sans-serif;">
            <h2>Tasdiqlash kodi</h2>
            <p>Sizning tasdiqlash kodingiz:</p>
            <h1 style="letter-spacing:5px;">${otp}</h1>
            <p style="font-size:12px;color:#777;">
                Kod 5 daqiqa amal qiladi.
            </p>
        </div>
        `,
});

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
        message:"Tastiqlash kodi yuborildi"
    })
})  

export default router;