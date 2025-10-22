import { z } from "zod";


export default z.object({
    SECRET_KEY: z.string(),
    MONGODB_URI: z.string().default("mongodb://127.0.0.1:27017/paramedia"),
    DB: z.string().default("paramedia"),
    USE_HTTPS: z.coerce.boolean().default(false),
    SSL_KEY_PATH: z.string().default("/etc/ssl/private/selfsigned.key"),
    SSL_CERT_PATH: z.string().default("/etc/ssl/certs/selfsigned.crt"),
    PORT: z.coerce.number().default(3000),
});