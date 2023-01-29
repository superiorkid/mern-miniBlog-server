import {Router} from "express";
import {FetchAllPost, CreateNewPost, DeletePost, UpdatePost, GetPostById} from "./post.controller";
import {body} from "express-validator";

const router = Router()

router.get('/', FetchAllPost)
router.post(
    '/',
    body("title").not().isEmpty(),
    body("body").not().isEmpty(),
    CreateNewPost)
router.get('/:id', GetPostById)
router.delete('/:id', DeletePost)
router.put(
    "/:id",
    body("title").not().isEmpty(),
    body("body").not().isEmpty(),
    UpdatePost)

export default router