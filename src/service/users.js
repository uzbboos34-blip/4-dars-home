import { join, extname } from "path"
import pool from "../database/config.js"
import { passCompare, passHash } from "../utils/bcrypt.js"
import { BedRequestError, ConflictError, InternalServerError, UnauthorizedError } from "../utils/error.js";
import { accessToken, refreshToken } from "../utils/jwt.js";

class UserService {

    async getAllUsers(){
        const users = await pool.query("select id, username, avatar from users")
        return users.rows
    }

    async register(body,files){
        const {username, password} = body
        const {file} = files

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

        const newUser = await pool.query("insert into users(username, password, avatar) values($1,$2,$3) RETURNING *", [username, await passHash(password), filename])
        const id = newUser.rows[0].id

        return {
            status:200,
            message:"User successfull created",
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