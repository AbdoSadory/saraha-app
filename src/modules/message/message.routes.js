import { Router } from 'express'
import * as messageControllers from './message.controllers.js'
import authHandler from '../../middlewares/authHandler.js'

const router = Router()

router.get(
  '/userMessages',
  authHandler(),
  messageControllers.getMessagesDependsOnView
)
router.post('/sendMessage/:sendTo', messageControllers.sendMessage)
router
  .route('/message/:messageId')
  .delete(authHandler(), messageControllers.deleteMessage)
  .put(authHandler(), messageControllers.updateMessage)

export default router
