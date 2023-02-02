import {Request, Router, Response} from "express";
import {FetchAllPost, CreateNewPost, DeletePost, UpdatePost, GetPostBySlug} from "./post.controller";
import {body} from "express-validator";

import authMiddleware from "../middlewares/auth.middleware";
import upload from '../config/upload'

const router = Router()

router.post(
    '/',
    upload,
    body("title").not().isEmpty(),
    body("body").not().isEmpty(),
    CreateNewPost)

router.get('/',authMiddleware, FetchAllPost)
router.get('/:slug', authMiddleware, GetPostBySlug)
router.delete('/:id', authMiddleware, DeletePost)
router.put(
    "/:id",
    authMiddleware,
    body("title").not().isEmpty(),
    body("body").not().isEmpty(),
    UpdatePost)

router.post('/upload/test', upload ,(req: Request, res: Response) => {
    console.log(req.body)
    console.log(req.file)
    console.log(req.file?.filename)

})




export default router