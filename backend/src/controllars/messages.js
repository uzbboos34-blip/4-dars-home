import messageService from "../service/messages.js";
class MessageControllar {
    async createMessage(req, res, next){
        try {
            const data = await messageService.createMessage(req)
            if (data) {
                res.status(data.status).json(data)
            }
        } catch (error) {
            next(error)
        }
    }

    async getAllMessages(req, res, next){
        try {
            const data = await messageService.getAllMessages(req)
            if (data) {
                res.status(data.status).json(data)
            }
        } catch (error) {
            next(error)
        }
    }
}

export default new MessageControllar()