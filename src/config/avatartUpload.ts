import multer from 'multer'
import {v4} from 'uuid'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/user/cover')
    }, filename: (req, file, cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join("-")
        cb(null, v4() + "-" + filename)
    }
})

const avatarUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == 'image/png' || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true)
        } else {
            cb(null, false)
            return cb(new Error("Only .png .jpg and .jpeg format allowed!"))
        }
    }
})

export default avatarUpload.single("avatar")