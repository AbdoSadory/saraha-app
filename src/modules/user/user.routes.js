import Router from 'express'
import * as userControllers from './user.controllers.js'
import authHandler from '../../middlewares/authHandler.js'
import uploadingFilesHandler from '../../middlewares/uploadingFilesHandler.js'
import allowedExtensions from '../../utils/allowedExtensions.js'

const router = Router()

router.post('/signUp', userControllers.signUp)
router.post('/signIn', userControllers.signIn)
router.post(
  '/uploadProfileImage',
  authHandler(),
  uploadingFilesHandler({
    allowedExtension: allowedExtensions.image,
    filePath: 'users',
  }).single('profileImage'),
  userControllers.uploadProfileImage
)
router.get('/profile', authHandler(), userControllers.getUser)
router.put('/updateProfile', authHandler(), userControllers.updateProfile)
router.delete('/deleteProfile', authHandler(), userControllers.deleteProfile)

export default router
