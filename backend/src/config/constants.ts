import dotenv from 'dotenv';
import environmentSchema from "../schema/environment.schema.ts";

dotenv.config({path: './.env', debug: false});


export const {
    SECRET_KEY,
    MONGODB_URI,
    DB,
    USE_HTTPS,
    SSL_KEY_PATH,
    SSL_CERT_PATH,
    PORT,
} = environmentSchema.parse(process.env);