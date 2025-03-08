
const Joi = require("joi");
const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must be less than 30 characters",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
    }),
});

const addEvent = Joi.object({
    eventName: Joi.string().required().messages({
        "string.empty": "Event is required",
    }),
    eventDate: Joi.string().required().messages({
        "string.empty": "Event date is required",
    }),
    category: Joi.string().required().messages({
        "string.empty": "Category is required",
    }),
    // image: Joi.string().uri().required().messages({
    //     "string.empty": "Image is required",
    //     "string.uri": "Image must be a valid URL",
    // }),
})

module.exports = { registerSchema, loginSchema, addEvent };
