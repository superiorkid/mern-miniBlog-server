import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";
import {validationResult} from "express-validator";

import {createSlug} from "./post.helper";

const prisma = new PrismaClient()

export const FetchAllPost = async (req: Request, res: Response) => {
    const {id} = req.body
    try {

        await prisma.post
            .findMany({
                where: {
                    author: {
                        id
                    }
                }
            })
            .then((post) => {
                res.status(200).json({
                    code: 200,
                    status: "OK",
                    message: "fetch all posts successfully",
                    data: post
                })
            })
            .catch((error) => {
                res.status(400).json({
                    code: 400,
                    status: "BAD_REQUEST",
                    message: "failed fetching posts"
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

export const CreateNewPost = async (req:Request, res:Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            status: "BAD_REQUEST",
            message: errors.array()
        })
    }

    const { id, title, body } = req.body
    const slug = createSlug(title)

    try {

        // check if slug already exists in database
        const checkSlug = await prisma.post.findUnique({
            where: {
                slug
            }
        })

        if (checkSlug) {
            return res.status(409).json({
                code: 409,
                status: "CONFLICT",
                message: "slug already exists in database"
            })
        }

        await prisma.post.create({
            data: {
                slug: slug,
                body: body,
                title: title,
                author: {
                    connect: {
                        id
                    }
                }
            }
        }).then((post) => {
            res.status(201).json({
                code: 201,
                status: "CREATED",
                message: "new post created successfully"
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

export const DeletePost = async (req: Request, res: Response) => {
    const {id} = req.params

    try {
        await prisma.post.delete({
            where: {
                id
            }
        }).then((data) => {
            res.status(200).json({
                code: 200,
                status: "OK",
                message: "delete post successfully"
            })
        }).catch((error) => {
            res.status(404).json({
                code: 404,
                status: "NOT_FOUND",
                message: "cannot found post you need"
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

export const UpdatePost = async (req: Request, res: Response) => {
    const {id} = req.params
    const { title, body} = req.body
    const slug = createSlug(title)

    try {
        await prisma.post.update({
            where: {
                id
            },
            data: {
                title,
                body,
                slug,
                updatedAt: new Date()
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

export const GetPostById = async (req: Request, res: Response) => {
    const {id} = req.params
    try {

        await prisma.post.findFirst({
            where: {
                id
            }
        }).then((data) => {
            res.status(200).json({
                code: 200,
                status: "OK",
                message: "find post successfully",
                data
            })
        }).catch((error) => {
            res.status(404).json({
                code: 404,
                status: "NOT_FOUND",
                message: "cannot found post"
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