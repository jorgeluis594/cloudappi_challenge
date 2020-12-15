const { string } = require('@hapi/joi');
const Joi = require('@hapi/joi');

const idSchema = Joi.string().regex(/^\d+$/);

const createUserScheema = Joi.object({
  name: Joi.string().max(50).required(),
  email: Joi.string().email().required(),
  birthDate: Joi.date().required(),
  address: Joi.object({
    street: Joi.string().max(50).required(),
    state: Joi.string().max(50).required(),
    city: Joi.string().max(20).required(),
    country: Joi.string().max(20).required(),
    zip: Joi.string().max(20).required(),
  }).required(),
});

const updateUserScheema = Joi.object({
  name: Joi.string().max(50),
  email: Joi.string().email(),
  birthDate: Joi.date(),
  address: Joi.object({
    street: Joi.string().max(50),
    state: Joi.string().max(50),
    city: Joi.string().max(20),
    country: Joi.string().max(20),
    zip: Joi.string().max(20),
  }),
});

module.exports = {
  idSchema,
  createUserScheema,
  updateUserScheema,
};
