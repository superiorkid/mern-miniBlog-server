import {Router} from "express";
import {SignUp, Login} from "./user.controller";
import {body} from "express-validator";

const router = Router()

router.post(
    '/signup',
    body("username").not().isEmpty().isLength({min: 3}).withMessage("username length min 3"),
    body("email").not().isEmpty().isEmail(),
    body("password").isLength({min: 5}).withMessage("password length min 5"),
    body("confirmPassword").custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("password confirmation does not match password")
        }
        return true
    }),
    SignUp)

router.post(
    "/login",
    body("email").not().isEmpty().isEmail(),
    body("password").not().isEmpty(),
    Login)

export default router