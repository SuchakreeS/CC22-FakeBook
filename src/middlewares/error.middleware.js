import { ZodError } from "zod"


export default function (err, req, res, next) {
    if(err instanceof ZodError) {
        return res.status(400).json({
            success : false ,
            errors : err.flatten().fieldErrors
        })
    }
    console.error(err)
    res.status(err.status || 500).json({
        status : err.status || 500,
        message: err.message || "Server Error"
    })
}