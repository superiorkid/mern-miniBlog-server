import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";
import {validationResult} from "express-validator";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const SignUp = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            status: "BAD_REQUEST",
            message: errors.array()
        })
    }

    const {username, email, password} = req.body

    try {

        const userExists = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (userExists) {
            return res.status(409).json({
                code: 409,
                status: "CONFLICT",
                message: "email already exists"
            })
        }

        const saltRounds: number = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        }).then((data) => {
            res.status(201).json({
                code: 201,
                status: "CREATED",
                message: "new user created successfully"
            })
        }).catch((error) => {
            res.status(500).json({
                code: 500,
                status: "INTERNAL_SERVER_ERROR",
                message: "something went wrong"
            })
        })

    } catch (error) {
        res.status(500).json({
            code: 500,
            status: "INTERNAL_SERVER_ERROR",
            message: "something went wrong"
        })
    }
}