import mongoose from 'mongoose'

const db_connection = async () => {
  await mongoose
    .connect(process.env.DB_STRING_CONNECTION)
    .then((res) => console.log('DB is connected'))
    .catch((err) => console.log('Error in DB Connection 🔴', err))
}

export default db_connection
