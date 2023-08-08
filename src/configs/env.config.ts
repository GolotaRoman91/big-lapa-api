import Joi from 'joi'

export interface IEnv {
  PORT: number
  MONGO_URL: string
  JWT_SECRET: string
  AWS_BUCKET_NAME: string
  AWS_BUCKET_REGION: string
  AWS_ACCESS_KEY: string
  AWS_SECRET_KEY: string
  BB2_SECRET_KEY: string
  BB2_SECRET_KEY_NAME: string
  BB2_FILES_BUCKET_ID: string
}

const baseString = Joi.string().required().exist()

export const envValidationSchea = Joi.object<IEnv>({
  PORT: Joi.number().exist().required(),
  MONGO_URL: baseString,
  JWT_SECRET: baseString,
  AWS_BUCKET_NAME: baseString,
  AWS_BUCKET_REGION: baseString,
  AWS_ACCESS_KEY: baseString,
  AWS_SECRET_KEY: baseString,
  BB2_SECRET_KEY: baseString,
  BB2_SECRET_KEY_NAME: baseString,
  BB2_FILES_BUCKET_ID: baseString,
})
