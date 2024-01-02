import path from 'path'
import fs from 'fs'
import multer from 'multer'
import allowedExtensions from '../utils/allowedExtensions.js'
import generateUniqueString from '../utils/generateUniqueString.js'

const uploadingFilesHandler = ({
  allowedExtension = allowedExtensions.image,
  filePath = 'general',
}) => {
  const destinationPath = path.resolve(`src/uploads/${filePath}`)
  console.log(filePath)
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true })
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      req.filePath = filePath
      cb(null, destinationPath)
    },
    filename: function (req, file, cb) {
      const uniquePrefix = generateUniqueString()
      cb(null, uniquePrefix + '_' + file.originalname)
    },
  })

  const fileFilter = (req, file, cb) => {
    if (allowedExtension.includes(file.mimetype.split('/')[1])) {
      return cb(null, true)
    }
    cb(new Error('Image format is not allowed!'), false)
  }
  const file = multer({ fileFilter, storage })
  return file
}

export default uploadingFilesHandler
