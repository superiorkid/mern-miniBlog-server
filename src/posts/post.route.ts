import {Request, Router, Response} from "express";
import {FetchAllPost, CreateNewPost, DeletePost, UpdatePost, GetPostBySlug, GetCoverImage} from "./post.controller";
import {body} from "express-validator";

import authMiddleware from "../middlewares/auth.middleware";
import articleUpload from '../config/articleUpload'

const router = Router()

router.post(
    '/',
    articleUpload,
    body("title").not().isEmpty(),
    body("body").not().isEmpty(),
    CreateNewPost)

router.get('/', FetchAllPost)
router.get('/:slug', authMiddleware, GetPostBySlug)
router.delete('/:id', authMiddleware, DeletePost)
router.put(
    "/:id",
    authMiddleware,
    body("title").not().isEmpty(),
    body("body").not().isEmpty(),
    UpdatePost)

router.get('/cover/:imageName', GetCoverImage)




export default router