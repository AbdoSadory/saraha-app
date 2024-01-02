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
    }

    const isUserExisted = await dbMethods.findByIdDocument(User, sendTo)
    if (!isUserExisted.success) {
      return next(
        new Error(isUserExisted.message, { cause: isUserExisted.status })
      )
    }
    const newMessage = await dbMethods.createDocument(Message, {
      content,
      sendTo,
    })
    if (!newMessage.success) {
      return next(new Error(newMessage.message, { cause: newMessage.status }))
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
    const { messageId } = req.params
    const { authUser } = req

    const isMessageExisted = await dbMethods.findByIdDocument(
      Message,
      messageId
    )
    if (!isMessageExisted.success) {
      return next(
        new Error(isMessageExisted.message, { cause: isMessageExisted.status })
      )
    }

    if (isMessageExisted.result.sendTo.toString() !== authUser._id.toString()) {
      return next(new Error("User doesn't have this message", { cause: 404 }))
    }

    const deleteMessage = await dbMethods.deleteOneDocument(Message, {
      _id: messageId,
    })
    if (!deleteMessage.success) {
      return next(
        new Error(deleteMessage.message, { cause: deleteMessage.status })
      )
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
    const { messageId } = req.params
    const { authUser } = req
    const isMessageExisted = await dbMethods.findByIdDocument(
      Message,
      messageId
    )
    if (!isMessageExisted.success) {
      return next(
        new Error(isMessageExisted.message, { cause: isMessageExisted.status })
      )
    }
    if (isMessageExisted.result.sendTo.toString() !== authUser._id.toString()) {
      return next(new Error("User doesn't have this message", { cause: 404 }))
    }

    const updateMessage = await dbMethods.findByIdAndUpdateDocument(
      Message,
      {
        _id: messageId,
        sendTo: authUser._id,
        isViewed: false,
      },
      { isViewed: true, $inc: { __v: 1 } }
    )
    if (!updateMessage.success) {
      return next(
        new Error(updateMessage.message, { cause: updateMessage.status })
      )
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
    const { isViewed } = req.query
    const { authUser } = req
    if (!isViewed) {
      return next(
        new Error('isViewed must be in query and not empty', { cause: 400 })
      )
    }
    const messages = await dbMethods.findDocuments(Message, {
      isViewed,
      sendTo: authUser._id,
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
