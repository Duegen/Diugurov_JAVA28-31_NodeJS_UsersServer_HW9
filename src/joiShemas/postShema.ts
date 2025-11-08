import Joi from "joi";

export const postShema = Joi.object({
    postId: Joi.number().integer().min(1).max(1000).required(),
    userId: Joi.number().integer().min(1).max(1000).required(),
    title: Joi.string().min(1).required(),
    text: Joi.string().min(1).required(),
})

export const postIdShema = Joi.object({
    postId: Joi.number().integer().min(1).max(1000).required(),
})

export const postNameShema = Joi.object({
    userName: Joi.string().alphanum().min(3).max(15).required(),
})