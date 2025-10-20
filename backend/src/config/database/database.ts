const { MongoClient } = require("mongodb")
const { seedDatabase } = require('./seedData');

class DatabaseConf {
    connStr: string;
    databaseName: string;
    client: any | null;
    db: any;
    constructor() {
        this.connStr = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/paramedia";
        this.databaseName = "paramedia";
        this.client = null;
        this.db = null;
    }
    async connect() {
        try {
            if (this.client) return;
            this.client = new MongoClient(this.connStr);
            await this.client.connect();
            this.db = this.client.db(this.databaseName);
            console.log("Connected to MongoDB database:", this.databaseName);
            await seedDatabase(this.db);
        } catch (error: any) {
            console.error("Failed to connect to MongoDB:", error);
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
module.exports = database;
