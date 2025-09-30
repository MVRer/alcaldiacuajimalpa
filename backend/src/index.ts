require('dotenv').config();
var cors = require("cors");
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

const database = require("./config/database/database");


async function StartApp() {
    try {
        await database.connect();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
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
