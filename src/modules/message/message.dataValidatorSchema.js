import Joi from 'joi'

export const createMessageSchema = {
  body: Joi.object({
    content: Joi.string().trim().min(4).max(350).required(),
  }),
}
