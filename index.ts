import app from './app'
import dotenv from "dotenv";

dotenv.config()

app.listen(process.env.PORT, () => {
    console.log(`✨ App running on http://localhost:${process.env.PORT}/`)
})