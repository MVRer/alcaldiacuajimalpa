import router from "./routes";
import https from "https";
import fs from "fs";

require('dotenv').config();
var cors = require("cors");
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const database = require("./config/database/database");


async function StartApp() {
    try {
        await database.connect();

        if (process.env.USE_HTTPS === 'true') {
            const httpsOptions = {
                key: fs.readFileSync(process.env.SSL_KEY_PATH || '/etc/ssl/private/selfsigned.key'),
                cert: fs.readFileSync(process.env.SSL_CERT_PATH || '/etc/ssl/certs/selfsigned.crt')
            };
            https.createServer(httpsOptions, app).listen(PORT, () => {
                console.log(`HTTPS Server is running on port ${PORT}`);
            });
        } else {
            app.listen(PORT, () => {
                console.log(`HTTP Server is running on port ${PORT}`);
            });
        }
    }
    catch (error) {
        console.error("Failed to start the application:", error);
    }
}

process.on('SIGINT', async () => {
    console.log('Killing the process...');
    await database.close();
    process.exit(0);
});

StartApp();
