import { join, extname } from "path"
import pool from "../database/config.js"
import { passCompare, passHash } from "../utils/bcrypt.js"
import { BedRequestError, ConflictError, InternalServerError, UnauthorizedError } from "../utils/error.js";
import { accessToken, refreshToken } from "../utils/jwt.js";
import fs from "fs";

class UserService {

    async getAllUsers(){
        const users = await pool.query("select id, username, avatar from users")
        
        return users.rows
    }

    async register(body,files){
        const {username, password, email, otp} = body
        const socketId = process.socketId
        const {file} = files
        

        const data = fs.readFileSync(join(process.cwd(), "src", "database", "otp.json"), "utf-8")
        let otps = JSON.parse(data) || []
        

        const existOtp = otps.find(o => o.otp == +otp && o.email == email)
        

        if (!existOtp) {
            throw new BedRequestError(400, "email or otp wrong")
        }


        const existUser = await pool.query("select * from users where username=$1", [username])

        if (existUser.rows.length) {
            throw new ConflictError(409, "User already exist")
        }
        const filename = Date.now() + extname(file.name)
        file.mv(join(process.cwd(), "src","uploads", "picture", filename), (error)=>{
            if (error) {
                throw new InternalServerError(500, "ImternalServerError")
            }
        })

        const newUser = await pool.query("insert into users(username, email, password, avatar, socket_id) values($1,$2,$3, $4, $5) RETURNING *", [username, email, await passHash(password), filename, socketId])
        const id = newUser.rows[0].id

        return {
            status:201,
            message:"User successfull created",
            avatar: filename,
            accessToken:accessToken(id, username),
            refreshToken:refreshToken(id, username)
        }
    }

    async login(body){
        const {username, password} = body

         const existUser = await pool.query("select * from users where username=$1", [username])

        if (!existUser.rows.length) {
            throw new BedRequestError(400, "Username or password wrong")
        }

        if (!await passCompare(password, existUser.rows[0].password)) {
            throw new BedRequestError(400, "Username or password wrong")
        }

        const id = existUser.rows[0].id

        return {
            status:200,
            message:"User successfull login",
            avatar: existUser.rows[0].avatar,
            accessToken:accessToken(id, username),
            refreshToken:refreshToken(id, username)
        }
    }

    async UserDelete(req){
        const {id} = req.user
        
        await pool.query("delete from files where user_id=$1", [id])
        await pool.query("delete from users where id=$1", [id])

        return{
            status:200,
            message:"User seccessfully deleted"
        }

    }
}
export default new UserService()