import {Router} from "express";
import {SignUp} from "./user.controller";

const router = Router()

router.post('/signup', SignUp)

export default router