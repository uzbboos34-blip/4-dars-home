import pool from "../database/config.js"
import { extname, join } from "path";
import { InternalServerError } from "../utils/error.js"

class MessageService {
    async createMessage(req){
        const {userIdTo} = req.params
        const {id} = req.user
        

        const user = await pool.query("select * from users where id=$1", [userIdTo])
        let file; 
        if (req.files) {
            file = req.files.file
        }
        
        const filename = file && Date.now() + extname(file.name)
        
        const newMessage = await pool.query("insert into messages (message_type, message, user_id_to,user_id_from) values ($1, $2, $3, $4) RETURNING *", 
            [file ? file.mimetype : "plan/text", file ? filename : req.body.message , userIdTo, id])
        
        process.io.to(user.rows[0].socket_id).emit("send_message", newMessage, file ? file.mimetype : "plan/text")    

        file && file.mv(join(process.cwd(), "src","uploads", "media", filename), (error)=>{
                    if (error) {
                        throw new InternalServerError(500, "ImternalServerError")
                    }
                })  
        return {
            status:201,
            message:"Message send"
        }
    }

    async getAllMessages(req){
        const {userIdTo} = req.params
        const {id} = req.user

        const message = await pool.query(`select * from messages where 
        (user_id_from = $1 and user_id_to = $2)
        or
        (user_id_to = $1 and user_id_from = $2)
        `, [id, userIdTo])


    return {
        status:200,
        message:message.rows
    }
    } 
}

export default new MessageService()