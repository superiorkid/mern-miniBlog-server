import {Router} from "express";
import {FetchAllPost, CreateNewPost, DeletePost, UpdatePost, GetPostBySlug} from "./post.controller";
import {body} from "express-validator";

import authMiddleware from "../middlewares/auth.middleware";

const router = Router()

router.get('/',authMiddleware, FetchAllPost)
router.post(
    '/',
    authMiddleware,
    body("title").not().isEmpty(),
    body("body").not().isEmpty(),
    CreateNewPost)
router.get('/:slug', authMiddleware, GetPostBySlug)
router.delete('/:id', authMiddleware, DeletePost)
router.put(
    "/:id",
    authMiddleware,
    body("title").not().isEmpty(),
    body("body").not().isEmpty(),
    UpdatePost)

export default router