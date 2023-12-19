import Router from 'express'
import * as userControllers from './user.controllers.js'

const router = Router()

router.get('/:id', userControllers.getUser)
router.post('/signUp', userControllers.signUp)
router.post('/signIn', userControllers.signIn)
router.put('/updateProfile', userControllers.updateProfile)
router.delete('/deleteProfile', userControllers.deleteProfile)

export default router
