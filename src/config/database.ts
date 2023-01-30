import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const connectDB = async () => {
    await prisma.$connect().then((connected) => {
        console.log("database connected successfully")
    }).catch((error) => {
        console.log("cannot connect to database")
        console.log(error)
        process.exit(1)
    })
}

export default connectDB