import UserService from "../service/users.js";
class UserControllar {

    async register(req, res, next){
        try {
            const data = await UserService.register(req.body, req.files)
            if (data) {
                return res.status(data.status).json(data)
            }
        } catch (error) {
            
            next(error)
        }
    }
    async login(req, res, next){
        try {
            const data = await UserService.login(req.body, req.files)
            if (data) {
                return res.status(data.status).json(data)
            }
        } catch (error) {
            console.log(error);
            
            next(error)
        }
    }
    async getAllUsers(req, res, next){
        try {
            const data = await UserService.getAllUsers()
            
            if (!data.length) {
                return res.status(200).json({
                    status:200,
                    message:"Users empty"
                })
            }
            return res.status(200).json({data})
        } catch (error) {
            next(error)
        }

    }

    async UserDelete(req, res, next){
        try {
            const data = await UserService.UserDelete(req)
            if (data) {
                return res.status(data.status).json(data)
            }
        } catch (error) {
            next(error)
        }
    }
}


export default new UserControllar()