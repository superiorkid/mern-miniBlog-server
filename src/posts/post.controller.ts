import { Request, Response } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";

import { createSlug, createTag } from "./post.helper";
import prisma from "../../prisma/prisma";
import fs from "fs";
import path from "path";
import {v4} from "uuid";

const ROOT_DIRECTORY = path.join(__dirname + '/../../../')


dotenv.config()

export const FetchAllPost = async (req: Request, res: Response) => {
  try {
    await prisma.post
      .findMany({
        include: {
          tags: true,
          author: {
            select: {
              username: true,
            },
          },
        },
      })
      .then((post) => {
        res.status(200).json({
          code: 200,
          status: "OK",
          message: "fetch all posts successfully",
          data: post,
        });
      })
      .catch((error) => {
        res.status(400).json({
          code: 400,
          status: "BAD_REQUEST",
          message: "failed fetching posts",
        });
      });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
      message: "something went wrong",
    });
  }
};

export const CreateNewPost = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      status: "BAD_REQUEST",
      message: errors.array(),
    });
  }

  const { userId, title, body, tags, thumbnail } = req.body;

  const cover = thumbnail.replace(/^data:([A-Za-z-+/]+);base64,/, '')

  const tag = await createTag(tags);
  const slug = createSlug(title);

  const extension = thumbnail.split(';')[0].split('/')[1]
  const filename = v4() + "-" + slug + '.' + extension

  try {
    // check if slug already exists in database
    const checkSlug = await prisma.post.findUnique({
      where: {
        slug,
      },
    });

    if (checkSlug) {
      return res.status(409).json({
        code: 409,
        status: "CONFLICT",
        message: "slug already exists in database",
      });
    }

    fs.writeFile(path.join(ROOT_DIRECTORY + `/public/post/thumbnail/${filename}`), cover, "base64", (err) => {
      if (err) {
        console.log(err)
        return res.status(415).json({
          code: 415,
          status: "UNSUPPORTED_MEDIA_TYPE",
          message: err.message
        })
      }

      prisma.post
        .create({
          data: {
            slug: slug,
            body: body,
            title: title,
            thumbnail: filename,
            tags: {
              create: tag,
            },
            author: {
              connect: {
                id: userId,
              },
            },
          },
        })
        .then((post) => {
          res.status(201).json({
            code: 201,
            status: "CREATED",
            message: "new post created successfully",
          });
        })
        .catch((error) => {
          res.status(500).json({
            code: 500,
            status: "INTERNAL_SERVER_ERROR",
            message: "something went wrong",
          });
        });

    })

  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
      message: "something went wrong",
    });
  }
};

export const DeletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.post
      .delete({
        where: {
          id,
        },
      })
      .then((data) => {
        res.status(200).json({
          code: 200,
          status: "OK",
          message: "delete post successfully",
        });
      })
      .catch((error) => {
        res.status(404).json({
          code: 404,
          status: "NOT_FOUND",
          message: "cannot found post you need",
        });
      });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
      message: "something went wrong",
    });
  }
};

export const UpdatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, body, tags, thumbnail, userId } = req.body;

  const cover = thumbnail.replace(/^data:([A-Za-z-+/]+);base64,/, '')

  const tag = await createTag(tags);
  const slug = createSlug(title);

  const extension = thumbnail.split(';')[0].split('/')[1]
  const filename = v4() + "-" + slug + '.' + extension

  try {

    fs.writeFile(path.join(ROOT_DIRECTORY, `/public/post/thumbnail/${filename}`), cover, 'base64', (err) => {
      if (err) {
        return res.status(415).json({
          code: 415,
          status: "UNSUPPORTED_MEDIA_TYPE",
          message: err.message
        })
      }

      prisma.post.update({
        where: {id},
        data: {
          title,
          body,
          slug,
          thumbnail: filename,
          tags: {
            create: tag
          },
          author: {
            connect: {
              id: userId
            }
          }
        }
      }).then((data) => {
        res.status(200).json({
          code: 200,
          status: 'OK',
          message: "post updated successfully"
        })
      }).catch((err) => {
        console.log(err)
        res.status(404).json({
          code: 404,
          status: "NOT_FOUND",
          message: err.message
        })
      })

    })

  } catch(error) {
    res.status(500).json({
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
      message: "something went wrong"
    })
  }

};

export const GetPostBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    await prisma.post
      .findUniqueOrThrow({
        where: {
          slug,
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
          tags: true
        },
      })
      .then((data) => {
        res.status(200).json({
          code: 200,
          status: "OK",
          message: "find post successfully",
          data,
        });
      })
      .catch((error) => {
        res.status(404).json({
          code: 404,
          status: "NOT_FOUND",
          message: "cannot found post",
        });
      });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "INTERNAL_SERVER_ERROR",
      message: "something went wrong",
    });
  }
};

export const GetCoverImage = async (req: Request, res: Response) => {
  const { imageName } = req.params;
  const readStream = fs.createReadStream(`public/post/thumbnail/${imageName}`);
  readStream.pipe(res);
};
