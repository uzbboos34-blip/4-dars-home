import  Joi from "joi";

class Validation {
    registerSchema = Joi.object({
        username:Joi.string().alphanum().min(3).max(20).required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,20}$')).required()
    })
}

export default new Validation()