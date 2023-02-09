import {Request, Response, NextFunction} from "express";
import jwt, {Secret} from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers['authorization']?.split(" ")[1]!
        const decoded = <IToken>jwt.verify(token, process.env.SECRET_KEY as Secret)
        req.body.userId = decoded.id
        next()
    } catch (error) {
        res.status(401).json({
            code: 401,
            status: "UNAUTHORIZED",
            message: "authentication failed"
        })
    }
}

export default authMiddleware