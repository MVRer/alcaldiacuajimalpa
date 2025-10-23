import dotenv from 'dotenv';
import environmentSchema from "../schema/environment.schema.ts";

dotenv.config({path: './.env', debug: false});


export const {
    SSL_CERT_PATH,
    SSL_KEY_PATH,
    MONGODB_URI,
    SECRET_KEY,
    USE_HTTPS,
    PORT,
    DB,
} = environmentSchema.parse(process.env);