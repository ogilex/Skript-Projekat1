const Joi = require("joi");

const newUserSchema = Joi.object({
    name: Joi.string().min(4).max(32).required(),
    username: Joi.string().min(4).max(15).required(),
    password: Joi.string().min(5).required(),
    role: Joi.string().required()
});

const updateUserSchema = Joi.object({
    name: Joi.string().min(4).max(32).required(),
    username: Joi.string().min(4).max(15).required(),
    password: Joi.string().min(5).required(),
    role: Joi.string().required()
});

const newPostSchema = Joi.object({
    title: Joi.string().min(4).max(40).required().required(),
    tagId: Joi.number().required().required(),
    content: Joi.string().max(500).required().required()
});

const updatePostSchema = Joi.object({
    title: Joi.string().min(4).max(40).required(),
    tagId: Joi.number().required(),
    content: Joi.string().max(500).required()
});

const newTagSchema = Joi.object({
    title: Joi.string().min(1).max(15).required()
});

const updateTagSchema = Joi.object({
    title: Joi.string().min(1).max(15).required()
});

const newCommentSchema = Joi.object({
    content: Joi.string().max(200).required(),
    postId: Joi.number().required()
});

const updateCommentSchema = Joi.object({
    content: Joi.string().max(200).required(),
    postId: Joi.number().required()
});

module.exports = { 
    newUserSchema,
    updateUserSchema,
    newPostSchema,
    updatePostSchema,
    newTagSchema,
    updateTagSchema,
    newCommentSchema,
    updateCommentSchema
};