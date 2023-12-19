import { Router } from 'express'
import * as messageControllers from './message.controllers.js'

const router = Router()

router.get('/user/:userId', messageControllers.getMessagesDependsOnView)
router.post('/sendMessage/:sendTo', messageControllers.sendMessage)
router
  .route('/message/:messageId/user/:userId')
  .delete(messageControllers.deleteMessage)
  .put(messageControllers.updateMessage)

export default router
