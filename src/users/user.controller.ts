import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";
import {validationResult} from "express-validator";
import bcrypt from 'bcrypt'
import jwt, {Secret} from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config()

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

    const {username, email, password}: IUserAuth = req.body

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

export const Login = async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            status: 'BAD_REQUEST',
            message: errors.array()
        })
    }

    const {email, password}: IUserAuth= req.body

    try {

        // check if user in database
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(404).json({
                code: 404,
                status: "NOT_FOUND",
                message: "user not found"
            })
        }

        const passwordValidation = await bcrypt.compare(password, user.password)

        if (!passwordValidation) {
            return res.status(401).json({
                code: 401,
                status: "UNAUTHORIZED",
                message: "password is incorrect"
            })
        }

        const token = jwt.sign({id: user.id}, process.env.SECRET_KEY as Secret, {
            expiresIn: "1d"
        })

        res.status(200).json({
            code: 200,
            status: "OK",
            message: "user logging in successfully",
            data: {
                token
            }
        })


    } catch (error) {
        res.status(500).json({
            code: 500,
            status: "INTERNAL_SERVER_ERROR",
            message: "something went wrong"
        })
    }

}