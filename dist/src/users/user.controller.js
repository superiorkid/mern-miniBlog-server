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
exports.SignUp = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const SignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        const userExists = yield prisma.user.findUnique({
            where: {
                email
            }
        });
        if (userExists) {
            return res.status(409).json({
                code: 409,
                status: "CONFLICT",
                message: "email already exists"
            });
        }
        yield prisma.user.create({
            data: {
                username,
                email,
                password
            }
        }).then((data) => {
            res.status(201).json({
                code: 201,
                status: "CREATED",
                message: "new user created successfully"
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
exports.SignUp = SignUp;
