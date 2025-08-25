const Joi = require('joi');

const listingSchema = Joi.object({
    Listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).optional(),
        category:Joi.string().required()
    }).required()
});

const reviewSchema = Joi.object({
    Review: Joi.object({
        name: Joi.string().required(),
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),

    }).required()
});

const contactSchema = Joi.object({
    contact: Joi.object({
        name: Joi.string().min(3).max(50).required().messages({
            'string.empty': 'Name is required.',
            'string.min': 'Name should have at least 3 characters.'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please enter a valid email.',
            'string.empty': 'Email is required.'
        }),
        message: Joi.string().min(10).max(500).required().messages({
            'string.empty': 'Message is required.',
            'string.min': 'Message should be at least 10 characters long.',
        })
    }).required()
});
module.exports = {
    listingSchema,
    reviewSchema,
    contactSchema
};




