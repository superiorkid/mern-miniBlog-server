"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostById = exports.UpdatePost = exports.DeletePost = exports.CreateNewPost = exports.FetchAllPost = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const post_helper_1 = require("./post.helper");
const prisma = new client_1.PrismaClient();
const FetchAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        yield prisma.post
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
            });
        })
            .catch((error) => {
            res.status(400).json({
                code: 400,
                status: "BAD_REQUEST",
                message: "failed fetching posts"
            });
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            status: "INTERNAL_SERVER_ERROR",
            message: "something went wrong"
        });
    }
});
exports.FetchAllPost = FetchAllPost;
const CreateNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            code: 400,
            status: "BAD_REQUEST",
            message: errors.array()
        });
    }
    const { id, title, body } = req.body;
    const slug = (0, post_helper_1.createSlug)(title);
    try {
        // check if slug already exists in database
        const checkSlug = yield prisma.post.findUnique({
            where: {
                slug
            }
        });
        if (checkSlug) {
            return res.status(409).json({
                code: 409,
                status: "CONFLICT",
                message: "slug already exists in database"
            });
        }
        yield prisma.post.create({
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
            });
        }).catch((error) => {
            res.status(500).json({
                code: 500,
                status: "INTERNAL_SERVER_ERROR",
                message: "something went wrong"
            });
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            status: "INTERNAL_SERVER_ERROR",
            message: "something went wrong"
        });
    }
});
exports.CreateNewPost = CreateNewPost;
const DeletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.post.delete({
            where: {
                id
            }
        }).then((data) => {
            res.status(200).json({
                code: 200,
                status: "OK",
                message: "delete post successfully"
            });
        }).catch((error) => {
            res.status(404).json({
                code: 404,
                status: "NOT_FOUND",
                message: "cannot found post you need"
            });
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            status: "INTERNAL_SERVER_ERROR",
            message: "something went wrong"
        });
    }
});
exports.DeletePost = DeletePost;
const UpdatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, body } = req.body;
    const slug = (0, post_helper_1.createSlug)(title);
    try {
        yield prisma.post.update({
            where: {
                id
            },
            data: {
                title,
                body,
                slug,
                updatedAt: new Date()
            }
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            status: "INTERNAL_SERVER_ERROR",
            message: "something went wrong"
        });
    }
});
exports.UpdatePost = UpdatePost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.post.findFirst({
            where: {
                id
            }
        }).then((data) => {
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            status: "INTERNAL_SERVER_ERROR",
            message: "something went wrong"
        });
    }
});
exports.getPostById = getPostById;
