import { config } from "dotenv";
import Jwt from "jsonwebtoken";
config()

export function accessToken(id, username) {
    return Jwt.sign({id, username}, process.env.JWT_SECRET,{expiresIn:"1h"})
}
export function refreshToken(id, username) {
    return Jwt.sign({id, username}, process.env.JWT_SECRET,{expiresIn:"1d"})
}

export function verifyToken(token) {    
    return Jwt.verify(token, process.env.JWT_SECRET)
}
