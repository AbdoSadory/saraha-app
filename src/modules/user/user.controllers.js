import bcryptjs from 'bcryptjs'
import User from '../../../DB/models/user.model.js'
import * as dbMethods from '../../../DB/dbMethods.js'
import generateToken from '../../utils/generateToken.js'

export const getUser = async (req, res, next) => {
  try {
    const { authUser } = req
    const user = await dbMethods.findByIdDocument(User, authUser._id)
    if (!user.success) {
      return next(
        new Error(user.message, {
          cause: user.status,
        })
      )
    }
    res.status(user.status).json({ message: user.message, result: user.result })
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }))
  }
}
export const signUp = async (req, res, next) => {
  /*
  1- Check on Incoming Data if they're Null
  2- Check on username if it's duplicated
  3- Check on email if it's duplicated
  4- Hashing Password
  5- Create User
  */
  try {
    const { username, email, password, profilePicture } = req.body
    if (!username || !email || !password) {
      return next(
        new Error('username, email and password should not be empty', {
          cause: 400,
        })
      )
    }
    const isUsernameExisted = await dbMethods.findOneDocument(User, {
      username,
    })
    if (isUsernameExisted.success) {
      return next(
        new Error('username is already existed', {
          cause: isUsernameExisted.status,
        })
      )
    }
    const isEmailExisted = await dbMethods.findOneDocument(User, { email })
    if (isEmailExisted.success) {
      return next(
        new Error('Email is already existed', {
          cause: isEmailExisted.status,
        })
      )
    }
    const hashedPassword = bcryptjs.hashSync(
      password,
      parseInt(process.env.HASH_SALT)
    )

    const createdUser = await dbMethods.createDocument(User, {
      username,
      email,
      password: hashedPassword,
      profilePicture,
    })

    if (!createdUser.success) {
      return next(
        new Error(createdUser.message, {
          cause: createdUser.status,
        })
      )
    }

    res.status(createdUser.status).json({
      message: createdUser.message,
      user: createdUser.result,
    })
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }))
  }
}
export const uploadProfileImage = async (req, res, next) => {
  try {
    const { authUser, filePath, file } = req
    const imgPath = filePath + '/' + file.filename
    const updateUser = await dbMethods.findByIdAndUpdateDocument(
      User,
      authUser._id,
      { profilePicture: imgPath }
    )

    if (!updateUser.success) {
      return next(new Error(updateUser.message, { cause: updateUser.status }))
    }

    res
      .status(updateUser.status)
      .json({ message: updateUser.message, user: updateUser.result })
  } catch (error) {
    return next(
      new Error('Error While Uploading Profile Image', { cause: 500 })
    )
  }
}
export const signIn = async (req, res, next) => {
  /*
  1- Find User with username OR email
  2- Check if incoming password doesn't match the Database hashed password
  */
  try {
    const { username, email, password } = req.body

    const user = await dbMethods.findOneDocument(User, {
      $or: [{ username }, { email }],
    })
    if (!user.success) {
      return next(
        new Error('Invalid login credentials', {
          cause: user.status,
        })
      )
    }

    const isPasswordMatched = bcryptjs.compareSync(
      password,
      user.result.password
    )
    if (!isPasswordMatched) {
      return next(
        new Error('Invalid login credentials', {
          cause: 401,
        })
      )
    }
    const token = generateToken({ id: user.result._id.toString() })
    user.result.token = token
    res.status(user.status).json({ message: user.message, user: user.result })
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }))
  }
}

export const updateProfile = async (req, res, next) => {
  /*
  1- Check if user is logged i
  2- Check on username if it's duplicated
  3- Check on email if it's duplicated
  4- Find user by ID and Update
  */
  try {
    const { authUser } = req
    const { username, email } = req.body

    const isUserExisted = await dbMethods.findByIdDocument(User, authUser._id)
    if (!isUserExisted.success) {
      return next(
        new Error(isUserExisted.message, { cause: isUserExisted.status })
      )
    }
    const updatedData = {}
    if (username) {
      const isUsernameExisted = await dbMethods.findOneDocument(User, {
        username,
      })
      if (isUsernameExisted.success) {
        return next(
          new Error('this username is already existed', { cause: 409 })
        )
      }
      updatedData.username = username
    }
    if (email) {
      const isEmailExisted = await dbMethods.findOneDocument(User, { email })
      if (isEmailExisted.success) {
        return next(new Error('this email is already existed', { cause: 409 }))
      }
      updatedData.email = email
    }

    const updatedUser = await dbMethods.findByIdAndUpdateDocument(
      User,
      { _id: authUser._id },
      updatedData
    )
    if (!updatedUser.success) {
      return next(
        new Error('Error While updating, please check the id and try again', {
          cause: 500,
        })
      )
    }
    res.status(updatedUser.status).json({
      message: updatedUser.message,
      user: updatedUser.result,
    })
  } catch (error) {
    return next(new Error(error.message, { cause: 500 }))
  }
}

export const deleteProfile = async (req, res, next) => {
  /*
  1- Check if user is logged in
  2- Find user by logged In ID and Delete
  */
  try {
    const { authUser } = req
    const isUserExisted = await dbMethods.findByIdDocument(User, authUser._id)
    if (!isUserExisted.success) {
      return next(
        new Error(isUserExisted.message, { cause: isUserExisted.status })
      )
    }

    const deletedUser = await dbMethods.findByIdAndDeleteDocument(
      User,
      authUser._id
    )
    if (!deletedUser.success) {
      return next(
        new Error('Error While deleting, please check the id and try again', {
          cause: 500,
        })
      )
    }

    res.status(deletedUser.status).json({
      message: 'Deleted Successfully',
    })
  } catch (error) {
    return next(
      new Error(error.message, {
        cause: 500,
      })
    )
  }
}
