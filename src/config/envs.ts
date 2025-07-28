import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  LOCAL_PORT: number;
  DB_PORT: number;
  DB_NAME: string;
  DATABASE_URL: string;
  API_KEY: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_HOST: joi.string().required(),
    LOCAL_PORT: joi.number().required(),
    DB_PORT: joi.number().required(),
    DB_NAME: joi.string().required(),
    DATABASE_URL: joi.string().uri().required(),
    API_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  dbUsername: envVars.DB_USERNAME,
  dbPassword: envVars.DB_PASSWORD,
  dbHost: envVars.DB_HOST,
  localPort: envVars.LOCAL_PORT,
  dbPort: envVars.DB_PORT,
  dbName: envVars.DB_NAME,
  databaseUrl: envVars.DATABASE_URL,
  apiKey: envVars.API_KEY,
};
