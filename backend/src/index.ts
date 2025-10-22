import { USE_HTTPS, PORT, SSL_KEY_PATH, SSL_CERT_PATH } from "./config/constants.ts";

import https from "https";
import fs from "fs";
import cors from "cors";
import express from "express";

import router from "./routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

import database from "./config/database/database";
import logger from "./utils/logger.ts";


async function StartApp() {
    try {
        await database.connect();

        if (USE_HTTPS) {
            const httpsOptions = {
                key: fs.readFileSync(SSL_KEY_PATH),
                cert: fs.readFileSync(SSL_CERT_PATH)
            };
            https.createServer(httpsOptions, app).listen(PORT, () => {
                console.log(`HTTPS Server is running on port ${PORT}`);
            });
        } else {
            app.listen(PORT, () => {
                console.log(`HTTP Server is running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error("Failed to start the application:", error);
    }
}

process.on('SIGINT', async () => {
    console.log('Killing the process...');
    logger.debug('Killing the process...');
    await database.close();
    process.exit(0);
});

StartApp();
