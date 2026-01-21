import FileService from "../service/files.js";
class FileControllar {
    async getAllUserFiles(req, res, next){
        try {  
            const data = await FileService.getAllUserFiles(req)
            return res.status(data.status).json(data)    
        } catch (error) {
            next(error)
        }
    }
    async Userfilas(req, res, next){
        try {
            
            const data = await FileService.Userfilas(req)
            
            if (data) {
                return res.status(data.status).json(data.files)
            }
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

    async getFile(req, res, next){
        try {
            const data = await FileService.getFile(req)
                
            if (!data.files.length) {
                return res.status(200).json({
                    status:200,
                    files:[]
                })
            }
            return res.status(data.status).sendFile(data.files)
        } catch (error) {
            next(error)
        }
    }
    async download(req, res, next){
        try {
            const data = await FileService.download(req)
            if (data) {
                return res.status(data.status).download(data.filePath)
            }
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