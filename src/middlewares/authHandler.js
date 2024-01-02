import jwt from 'jsonwebtoken'
import * as dbMethods from '../../DB/dbMethods.js'
import User from '../../DB/models/user.model.js'

const authHandler = () => {
  return async (req, res, next) => {
    try {
      const { accesstoken } = req.headers
      if (!accesstoken) {
        return next(
          new Error(
            'accesstoken not found, Please add accesstoken in headers',
            { cause: 400 }
          )
        )
      }
      if (!accesstoken.startsWith(process.env.TOKEN_PREFIX)) {
        return next(
          new Error(
            "accesstoken doesn't contain the agreed prefix, Please add our prefix",
            { cause: 400 }
          )
        )
      }

      const token = accesstoken.split(process.env.TOKEN_PREFIX)[1]
      const verifiedData = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
      if (!verifiedData || !verifiedData.id) {
        return next(new Error('Invalid Token', { cause: 401 }))
      }

      const user = await dbMethods.findByIdDocument(User, verifiedData.id)
      if (!user.success) {
        return next(
          new Error('Invalid Token, no user with this id', {
            cause: 401,
          })
        )
      }

      req.authUser = user.result
      next()
    } catch (error) {
      return next(
        new Error('Something is wrong while authentication', { cause: 500 })
      )
    }
  }
}

export default authHandler
