import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  BACKEND_PORT: Joi.number().port().default(8080),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  REDIS_URL: Joi.string().uri().optional(),
  TICK_INTERVAL_MS: Joi.number().integer().positive().default(10_000),
  GAME_LOOP_TICK_MS: Joi.number().integer().positive().default(10_000),
  ACCOUNT_AUTO_ACTIVATE: Joi.boolean()
    .truthy('true', '1')
    .falsy('false', '0')
    .default(false),
  GAME_SMOKE_FAST_BUILD: Joi.boolean()
    .truthy('true', '1')
    .falsy('false', '0')
    .default(false),
});
