import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .required(),

  PORT: Joi.number().required(),

  JWT_SECRET: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),
});
