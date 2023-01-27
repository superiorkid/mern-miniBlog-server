"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_route_1 = __importDefault(require("./src/posts/post.route"));
const user_route_1 = __importDefault(require("./src/users/user.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use('/post', post_route_1.default);
app.use('/auth', user_route_1.default);
app.get('/', (req, res) => {
    res.send("hello world");
});
exports.default = app;
