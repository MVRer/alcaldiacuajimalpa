const { MongoClient } = require("mongodb")
const bcrypt = require('bcrypt');
class DatabaseConf {
    connStr: string;
    databaseName: string;
    client: any | null;
    db: any;
    default_user: string;
    default_password: string;
    constructor() {
        this.connStr = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/paramedia";
        this.databaseName = "paramedia";
        this.client = null;
        this.db = null;
        this.default_user = "admin@paramedia.com";
        this.default_password = "admin123";

        
    }
    async connect() {
        try {
            if (this.client) return;
            this.client = new MongoClient(this.connStr);
            await this.client.connect();
            this.db = this.client.db(this.databaseName);
            //console.log(this.db);
            console.log("Connected to MongoDB database:", this.databaseName);
            const user = await this.db.collection('users').findOne({ correo_electronico: this.default_user });
            console.log('Checking for existing user:', user);
            
            if (!user) {
                await this.db.collection('users').insertOne({
                    nombre: "Admin",
                    apellidos: "",
                    fecha_nacimiento: "00-00-00",
                    fecha_registro: new Date().toISOString().split('T')[0],
                    telefono: "0000000000",
                    correo_electronico: this.default_user,
                    password: await bcrypt.hash(this.default_password, parseInt(process.env.SALT_ROUNDS || "10")),
                    curp: "AAAA000000AAAAAA00",
                    direccion: "Calle Falsa 123, Ciudad, Pais",
                    agregado_por: 0,
                    eliminado_por: null,
                    rol: "admin",
                    permissions: ['*'],
                });
                console.log('Default admin user created with correo_electronico:', this.default_user, 'and password:', this.default_password, "please change the password after first login.");
            } else {
                console.log('Default admin user already exists');
            }
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
