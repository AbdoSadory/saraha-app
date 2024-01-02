import Joi from 'joi'

export const signUpSchema = {
  body: Joi.object({
    username: Joi.string().trim().min(3).required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().alphanum().min(6).required(),
  }),
}

export const signInSchema = {
  body: Joi.object({
    username: Joi.string().trim().min(3),
    email: Joi.string().email().trim(),
    password: Joi.string().trim().alphanum().min(6).required(),
  })
    .with('email', 'password')
    .with('username', 'password'),
}

export const updateProfileSchema = {
  body: Joi.object({
    username: Joi.string().trim().min(3),
    email: Joi.string().email().trim(),
  }),
}
