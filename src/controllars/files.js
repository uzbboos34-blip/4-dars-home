import FileService from "../service/files.js";
class FileControllar {
    async getAllFiles(req, res, next){
        try {  
            const data = await FileService.getAllFiles(req.user.id)
            return res.status(data.status).json(data)    
        } catch (error) {
            next(error)
        }
    }
    async getAllUsers(req, res, next){
        try {  
            const data = await FileService.getAllUsers(req)
            
            if (!data.user.length) {
                return res.status(200).json({
                    status:200,
                    message:"Users empty"
                })
            }
            return res.status(data.status).json(data)    
        } catch (error) {
            next(error)
        }
    }

    async createFile(req, res, next){
        try {
            const data = await FileService.createFile(req, next)
            if (data) {
                return res.status(data.status).json(data)
            }
        } catch (error) {
            next(error)
            
        }
    }
    async fileUpdate(req, res, next){
        try {
            const data = await FileService.fileUpdate(req, next)
            if (data) {
                return res.status(data.status).json(data)
            }
        } catch (error) {
            next(error)
            
        }
    }
    async fileDelete(req, res, next){
        try {
            const data = await FileService.fileDelete(req)
            if (data) {
                return res.status(data.status).json(data)
            }
        } catch (error) {
            next(error)
            
        }
    }
    
}
export default  new FileControllar()