import jwt from 'jsonwebtoken'

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY, {
    expiresIn: '24h',
  })
  console.log('Token has been created 👌')
  return token
}

export default generateToken
