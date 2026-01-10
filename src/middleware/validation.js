import { BedRequestError } from "../utils/error"
import validations from "../validations/validations.js"

class UserMiddleware {
    register = (req, res, next)=>{
        try {
            const {error} = validations.registerSchema.validate(req.body)
            if (error) {
                throw new BedRequestError(400, error.details[0].message)
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default new UserMiddleware()