import express, {Express, Request, Response} from 'express'
import Cors from 'cors'
import bodyParser from "body-parser"

import PostRoute from "./src/posts/post.route";
import UserRoute from "./src/users/user.route";
import connectDB from "./src/config/database";

const app: Express = express()

connectDB()

app.use(Cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/post', PostRoute)
app.use('/auth', UserRoute)

app.get('/', (req: Request, res: Response) => {
    res.send("hello world")
})

export default app