import { config } from "dotenv";
import { Environments } from "../schema/enums/env.enum";

config({});

const {
  DATABASE_URL,
  PORT,
  JWT_SECRET,
  NODEMAILER_PASS,
  NODEMAILER_EMAIL,
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  NODE_ENV,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;

const secrets = {
  databaseUrl: <string>DATABASE_URL,
  port: <string>PORT,
  jwtSecret: <string>JWT_SECRET,
  nodemailer: {
    user: <string>NODEMAILER_EMAIL,
    pass: <string>NODEMAILER_PASS,
  },
  frontendUrl: <string>FRONTEND_URL,
  google: {
    clientId: <string>GOOGLE_CLIENT_ID,
    clientSecret: <string>GOOGLE_CLIENT_SECRET,
  },
  cloudinary: {
    apiKey: <string>CLOUDINARY_API_KEY,
    apiSecret: <string>CLOUDINARY_API_SECRET,
    cloudName: <string>CLOUDINARY_CLOUD_NAME,
  },

  nodeEnv: <string | Environments>NODE_ENV,
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
  },
};

export default secrets;
