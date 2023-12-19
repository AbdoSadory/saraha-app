import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isViewed: {
      type: Boolean,
      required: true,
      default: false,
    },
    sendTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

const Message = mongoose.model('Message', messageSchema)

export default Message
