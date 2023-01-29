import {Request, Response, NextFunction} from "express";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
    } catch (error) {
        res.status(401).json({
            code: 401,
            status: "UNAUTHORIZED",
            message: "authentication failed"
        })
    }
}

export default authMiddleware