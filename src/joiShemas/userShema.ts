import Joi from "joi";

export const userIdShema = Joi.object({
    userId: Joi.number().integer().min(1).max(1000).required(),
})

export const userShema = Joi.object({
    userId: Joi.number().integer().min(1).max(1000).required(),
    userName: Joi.string().alphanum().min(3).max(15).required(),
})

export const userIdNewnameShema = Joi.object({
    userId: Joi.number().integer().min(1).max(1000).required(),
    newName: Joi.string().alphanum().min(3).max(15).required(),
})