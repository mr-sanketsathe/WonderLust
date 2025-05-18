const Joi = require('joi');

const listingSchema = Joi.object({
     title: Joi.string().required().min(1).max(30),
     description: Joi.string().required().min(5).max(100),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(1).required(),
    image: Joi.string().allow('', null)
});

module.exports = listingSchema;
