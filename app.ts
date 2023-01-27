import express, {Express, Request, Response} from 'express'
import Cors from 'cors'
import bodyParser from "body-parser"

import PostRoute from "./src/posts/post.route";
import UserRoute from "./src/users/user.route";

const app: Express = express()
app.use(Cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/post', PostRoute)
app.use('/auth', UserRoute)

app.get('/', (req: Request, res: Response) => {
    res.send("hello world")
})

export default app