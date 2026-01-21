import { join } from "path";
import fs from "fs";
export default (error, req, res, next)=>{
    if (error.status && error.status < 500) {
        return res.status(error.status).json({
            status:error.status,
            message:error.message,
            name:error.name
        })
    }else{
        const existText = `[${new Date().toISOString()}]--${req.method}--${req.url}--${error}\n`
        fs.appendFileSync(join(process.cwd(),"src","logs","logger.txt"),existText)
        return res.status(500).json({
            status:500,
            message:"InternalServerError"
        })
    }
}
