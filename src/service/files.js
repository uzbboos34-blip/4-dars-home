import pool from "../database/config.js"
import { BedRequestError, InternalServerError, NotFoundError } from "../utils/error.js"
import { extname, join } from "path";
import fs from "fs";

class FileService {
    async getAllFiles(userId){
        const files = await pool.query("select * from files where user_id=$1", [userId])
        if (!files.rowCount) {
            return{
                status:200,
                message:"User has no videos",
                files: []
            }
        }
        
        return {
            status:200,
            files:files.rows
        } 
    }

    async getAllUsers(req){
        const {search} = req.query

        const users = await pool.query("select files.id, files.title, files.size,  files.created_at, json_build_object('id',users.id, 'username',users.username) as user from files inner join users on files.user_id = users.id where files.title ilike $1 or users.username ilike $1", [`%${search}%`])
        return {
            status:200,
            user: users.rows
        }

    }

    async createFile(req, next){
        const {id} = req.user
        const {title} = req.body
        const {file} = req.files

        const user = await pool.query("select id from users WHERE id=$1", [id]);

        if (!user.rowCount) {
            throw new NotFoundError(404, "User not found");
        }

        

        const existFile = [".mp4",".mkv",".avi",".mov",".webm",".flv",".wmv",".m4v",".3gp"];
        
        if (!existFile.includes(extname(file.name))) {
            throw new BedRequestError(400, "Not supported file")
        }

        if (file.size /1024/1024 < 1) {
            file.size = Math.ceil((file.size /1024/1024))
        }else{
            file.size = Math.floor((file.size /1024/1024))
        }

        const filename = Date.now() + extname(file.name)
        
        const existUser = await pool.query("select * from users where id=$1", [id])
        
        if (!existUser.rows.length) {
            throw new NotFoundError(404, "User not found")
        }

        await file.mv(join(process.cwd(), "src", "uploads", "videos", filename),(error)=>{
            if (error) {
                throw new InternalServerError(500, error)
            }
        })

        await pool.query("insert into files(title, user_id, file_name, size) values($1, $2, $3, $4)", [title, id, filename, file.size])

        return {
            status: 201,
            message: "File successfully created",
        };
    }
    async fileUpdate(req, next){
        const {id} = req.user
        const{fileId} = req.params
        const {title} = req.body

        const existFile =  await pool.query("select * from files where user_id=$1 and id=$2", [id, fileId])

        if (!existFile.rowCount) {
            throw new NotFoundError(404, "Not found file of this user")
        }

        await pool.query("update files set title=$1 where id=$2", [title, fileId])

        return{
            status:201,
            message:"File seccessfully update"
        }

    }

    async fileDelete(req){
        const {id} = req.user
        const { fileId } = req.params

        const existFile =  await pool.query("select * from files where user_id=$1 and id=$2", [id, fileId])

        if (!existFile.rowCount) {
            throw new NotFoundError(404, "Not found file of this user")
        }

        await pool.query("delete from files where id=$1", [fileId])
        fs.unlinkSync(join(process.cwd(), "src", "uploads", "videos", existFile.rows[0].file_name))
        return{
            status:200,
            message:"File seccessfully deleted"
        }
    }
}
export default new FileService()