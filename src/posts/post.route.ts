import { Request, Router, Response } from "express";
import {
  FetchAllPost,
  CreateNewPost,
  DeletePost,
  UpdatePost,
  GetPostBySlug,
  GetCoverImage,
  GetPostTags,
} from "./post.controller";
import { body } from "express-validator";
import multer from "multer";

import authMiddleware from "../middlewares/auth.middleware";

const router = Router();
const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
});

router.post(
  "/",
  upload.single("thumbnail"),
  body("title").not().isEmpty(),
  body("body").not().isEmpty(),
  body("tags").not().isEmpty(),
  authMiddleware,
  CreateNewPost
);

router.get("/", FetchAllPost);
router.get("/tag", GetPostTags);
router.get("/:slug", GetPostBySlug);
router.delete("/:id", authMiddleware, DeletePost);
router.put(
  "/:id",
  upload.single("thumbnail"),
  body("title").not().isEmpty(),
  body("body").not().isEmpty(),
  authMiddleware,
  UpdatePost
);

router.get("/cover/:imageName", GetCoverImage);

export default router;
