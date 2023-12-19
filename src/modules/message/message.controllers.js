import * as dbMethods from '../../../DB/dbMethods.js'
import Message from '../../../DB/models/message.model.js'
import User from '../../../DB/models/user.model.js'

export const sendMessage = async (req, res, next) => {
  /* 
 1- Check if the content is not null
 2- Check if user is exist
 3- Create Message
*/
  try {
    const { content } = req.body
    const { sendTo } = req.params
    if (!content) {
      return next(new Error('Content should not be empty', { cause: 400 }))
      //   return res.status(400).json({ message: 'Content should not be empty' })
    }

    const isUserExisted = await dbMethods.findByIdDocument(User, sendTo)
    if (!isUserExisted.success) {
      return next(
        new Error(isUserExisted.message, { cause: isUserExisted.status })
      )
      //   return res.status(isUserExisted.status).json({ message: isUserExisted.message })
    }
    const newMessage = await dbMethods.createDocument(Message, {
      content,
      sendTo,
    })
    if (!newMessage.success) {
      return next(new Error(newMessage.message, { cause: newMessage.status }))
      //   return res.status(newMessage.status).json({ message: newMessage.message })
    }

    res.status(newMessage.status).json({
      message: newMessage.message,
      newMessage: newMessage.result,
    })
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }))
  }
}

export const deleteMessage = async (req, res, next) => {
  /* 
 1- Check if the user is logged In
 2- Check if message is existed
 3- Check if message doesn't belong to the logged in user
 4- Delete
*/
  try {
    const { messageId, userId } = req.params
    const { loggedInID } = req.query
    if (userId !== loggedInID) {
      return next(new Error('You have to log in', { cause: 401 }))
      //   return res.status(401).json({ message: 'You have to log in' })
    }

    const isMessageExisted = await dbMethods.findByIdDocument(
      Message,
      messageId
    )
    if (!isMessageExisted.success) {
      return next(
        new Error(isMessageExisted.message, { cause: isMessageExisted.status })
      )
      //   return res.status(isMessageExisted.status).json({ message: isMessageExisted.message })
    }

    if (isMessageExisted.result.sendTo.toString() !== loggedInID) {
      return next(new Error("User doesn't have this message", { cause: 404 }))
      //   return res.status(404).json({ message: "User doesn't have this message" })
    }

    const deleteMessage = await dbMethods.deleteOneDocument(Message, {
      _id: messageId,
    })
    if (!deleteMessage.success) {
      return next(
        new Error(deleteMessage.message, { cause: deleteMessage.status })
      )
      //   return res.status(deleteMessage.status).json({ message: deleteMessage.message })
    }

    res.status(deleteMessage.status).json({ message: deleteMessage.message })
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }))
  }
}

export const updateMessage = async (req, res, next) => {
  /* 
 1- Check if the user is logged In
 2- Check if message is existed
 3- Check if message doesn't belong to the logged in user
 4- find the message and update
*/
  try {
    const { messageId, userId } = req.params
    const { loggedInID } = req.query
    if (userId !== loggedInID) {
      return next(new Error('You have to log in', { cause: 401 }))

      //   return res.status(401).json({ message: 'You have to log in' })
    }
    const isMessageExisted = await dbMethods.findByIdDocument(
      Message,
      messageId
    )
    if (!isMessageExisted.success) {
      return next(
        new Error(isMessageExisted.message, { cause: isMessageExisted.status })
      )
      //   return res.status(isMessageExisted.status).json({ message: isMessageExisted.message })
    }

    if (isMessageExisted.result.sendTo.toString() !== loggedInID) {
      return next(new Error("User doesn't have this message", { cause: 404 }))
      //   return res.status(404).json({ message: "User doesn't have this message" })
    }

    const updateMessage = await dbMethods.findByIdAndUpdateDocument(
      Message,
      {
        _id: messageId,
        sendTo: loggedInID,
        isViewed: false,
      },
      { isViewed: true, $inc: { __v: 1 } }
    )
    if (!updateMessage.success) {
      return next(
        new Error(updateMessage.message, { cause: updateMessage.status })
      )
      //   return res.status(updateMessage.status).json({ message: updateMessage.message })
    }
    res.status(updateMessage.status).json({
      message: updateMessage.message,
      updatedMessage: updateMessage.result,
    })
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }))
  }
}

export const getMessagesDependsOnView = async (req, res, next) => {
  /* 
 1- Check if the user is logged In
 2- Check if isView isn't empty
 3- Get messages with isView and SendTo id
*/
  try {
    const { userId } = req.params
    const { loggedInID, isViewed } = req.query
    if (userId !== loggedInID) {
      return next(new Error('You have to log in', { cause: 401 }))
      //   return res.status(401).json({ message: 'You have to log in' })
    }
    if (!isViewed) {
      return next(
        new Error('isViewed must be in query and not empty', { cause: 400 })
      )
      //   return res.status(400).json({ message: 'isViewed must be in query and not empty' })
    }
    const messages = await dbMethods.findDocuments(Message, {
      isViewed,
      sendTo: loggedInID,
    })
    if (!messages.result) {
      return res
        .status(messages.status)
        .json({ message: messages.message, messages: [] })
    }

    res.status(messages.status).json({
      message: messages.message,
      messages: messages.result,
    })
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }))
  }
}
