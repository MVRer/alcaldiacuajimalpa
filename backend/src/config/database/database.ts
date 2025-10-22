import { MongoClient } from "mongodb";
import { seedDatabase } from './seedData';
import { MONGODB_URI, DB } from "../constants.ts";
import logger from "../../utils/logger.ts";


class DatabaseConf {
    connStr: string;
    databaseName: string;
    client: any | null;
    db: any;

    constructor() {
        this.connStr = MONGODB_URI;
        this.databaseName = DB;
        this.client = null;
        this.db = null;
    }

    async connect() {
        try {
            if (this.client) return;
            this.client = new MongoClient(this.connStr);
            await this.client.connect();
            this.db = this.client.db(this.databaseName);

            console.log(`Connected to MongoDB database: ${this.databaseName}`);
            logger.info(`Connected to MongoDB database: ${this.databaseName}`);

            await seedDatabase(this.db);
        } catch (error: any) {
            console.error(`Failed to connect to MongoDB: ${error}`);
            logger.error(`Failed to connect to MongoDB: ${error}`);
            throw error;
        }
    }

    async close() {
        if (this.client) {
            this.client.close();
            this.client = null;
            this.db = null;
        }
    }
}

const database = new DatabaseConf();
export default database;