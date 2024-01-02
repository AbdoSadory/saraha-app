import { customAlphabet, nanoid } from 'nanoid'

const generateUniqueString = () => {
  const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMN', 10)
  return nanoid()
}

export default generateUniqueString
