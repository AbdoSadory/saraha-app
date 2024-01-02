import path from 'path'
import express from 'express'
import db_connection from './DB/connection.js'
import { config } from 'dotenv'
import userRouter from './src/modules/user/user.routes.js'
import messageRouter from './src/modules/message/message.routes.js'
import globalErrorHandler from './src/middlewares/globalErrorHandler.js'
const app = express()
config()
app.use(express.json())
db_connection()
app.use('/static', express.static(path.resolve('src/uploads')))
app.use('/users', userRouter)
app.use('/messages', messageRouter)

app.use('*', (req, res, next) => {
  res.json({ message: 'Invalid URL' })
})
app.use(globalErrorHandler)
app.listen(process.env.PORT, () => {
  console.log('Server is on Port 3000 🔥🔥🔥🔥')
})
