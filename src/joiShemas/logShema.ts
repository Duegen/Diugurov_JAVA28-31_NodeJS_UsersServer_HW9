import Joi from 'joi';

export const logShema = Joi.object({
    type: Joi.string().valid(
        'service',
        'getAllUsers', 'getUserById', 'addUser', 'updateUser', 'removeUser',
        'getAllPosts', 'getPostById', 'getPostsByUserName', 'addPost', 'removePost',
        'unknown'
        ).required(),
})