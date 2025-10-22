import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import { SALT_ROUNDS } from "../constants.ts";


/**
 * Seed database with default admin, dummy users, and reports
 */
async function seedDatabase(db: any) {
    const defaultUser = "admin@paramedia.com";
    const defaultPassword = await bcrypt.hash("123", SALT_ROUNDS);

    const existingUser = await db.collection("users").findOne({correo_electronico: defaultUser});

    if (!existingUser) {
        await db.collection("users").insertOne({
            nombre: "Admin",
            apellidos: "Sistema",
            fecha_nacimiento: "1990-01-01",
            fecha_registro: new Date().toISOString().split("T")[0],
            telefono: "5555555555",
            correo_electronico: defaultUser,
            password: defaultPassword,
            curp: "ADSI900101HDFLNS00",
            direccion: "Av. Stim 1321, Lomas de Vista Hermosa, Cuajimalpa, CDMX",
            agregado_por: null,
            eliminado_por: null,
            role: "admin",
            turnos: [],
            permissions: ["*"],
        });
        console.log("Default admin user created:", defaultUser);
    } else {
        console.log("Default admin user already exists");
    }

    // --- USERS ---
    const existingUsers = await db.collection("users").countDocuments();
    if (existingUsers <= 1) {
        const staticUsers = [
            {
                nombre: "Carlos",
                apellidos: "Hernández López",
                fecha_nacimiento: "1988-05-15",
                fecha_registro: new Date().toISOString().split("T")[0],
                telefono: "5551234567",
                correo_electronico: "carlos.hernandez@paramedia.com",
                password: defaultPassword,
                curp: "HELC880515HDFPRR01",
                direccion: "Av. Observatorio 100, Cuajimalpa, CDMX",
                agregado_por: null,
                eliminado_por: null,
                role: "turnchief",
                turnos: ["LV-8am3pm", "LV-3pm9pm"],
                permissions: ["view_turn_reports", "view_turn_users"],
            },
            {
                nombre: "María",
                apellidos: "García Ramírez",
                fecha_nacimiento: "1992-08-22",
                fecha_registro: new Date().toISOString().split("T")[0],
                telefono: "5559876543",
                correo_electronico: "maria.garcia@paramedia.com",
                password: defaultPassword,
                curp: "GARM920822MDFRMR08",
                direccion: "Camino al Olivo 56, Contadero, Cuajimalpa, CDMX",
                agregado_por: null,
                eliminado_por: null,
                role: "paramedic",
                turnos: ["LV-8am3pm", "LMV-9pm8am"],
                permissions: ["view_my_reports", "create_reports"],
            },
            {
                nombre: "José Luis",
                apellidos: "Martínez Sánchez",
                fecha_nacimiento: "1985-03-10",
                fecha_registro: new Date().toISOString().split("T")[0],
                telefono: "5556789012",
                correo_electronico: "jose.martinez@paramedia.com",
                password: defaultPassword,
                curp: "MASJ850310HDFRNL04",
                direccion: "Av. Bosques 234, Bosques de las Lomas, Cuajimalpa, CDMX",
                agregado_por: null,
                eliminado_por: null,
                role: "paramedic",
                turnos: ["MJD-9pm-8am", "SDF-8am-9pm"],
                permissions: ["view_my_reports", "create_reports"],
            },
        ];

        const roles = ["paramedic", "turnchief", "dispatcher", "coordinator"];
        const extraUsers = Array.from({length: 10}).map(() => {
            const role = faker.helpers.arrayElement(roles);
            return {
                nombre: faker.person.firstName(),
                apellidos: faker.person.lastName(),
                fecha_nacimiento: faker.date
                    .birthdate({min: 1970, max: 2000, mode: "year"})
                    .toISOString()
                    .split("T")[0],
                fecha_registro: new Date().toISOString().split("T")[0],
                telefono: faker.phone.number("55########"),
                correo_electronico: faker.internet
                    .email()
                    .toLowerCase()
                    .replace(/[^a-z0-9@._-]/g, ""),
                password: defaultPassword,
                curp: faker.string.alphanumeric(18).toUpperCase(),
                direccion: faker.location.streetAddress({useFullAddress: true}) + ", Cuajimalpa, CDMX",
                agregado_por: null,
                eliminado_por: null,
                role,
                turnos: faker.helpers.arrayElements(
                    ["LV-8am3pm", "LV-3pm9pm", "MJD-9pm8am", "SDF-8am9pm"],
                    faker.number.int({min: 1, max: 2})
                ),
                permissions:
                    role === "paramedic"
                        ? ["view_my_reports", "create_reports"]
                        : role === "turnchief"
                            ? ["view_turn_reports", "view_turn_users"]
                            : ["view_all_reports"],
            };
        });

        await db.collection("users").insertMany([...staticUsers, ...extraUsers]);
        console.log("👥 Dummy users created:", staticUsers.length + extraUsers.length);
    }

    const existingReports = await db.collection("reports").countDocuments();
    if (existingReports === 0) {
        const allUsers = await db.collection("users").find({}).toArray();
        const userNames = allUsers.map((u: any) => `${u.nombre} ${u.apellidos}`);

        const baseReports = [
            {
                folio: 1001,
                tiempo_fecha: "2025-01-15T10:30:00",
                tiempo_fecha_atencion: "2025-01-15T10:45:00",
                ubi: "Av. Paseo de la Reforma 2620, Lomas Altas, Cuajimalpa, CDMX",
                codigoPostal: "05110",
                modo_de_activacion: "C5",
                gravedad_emergencia: 2,
                tipo_servicio: ["accidente", "rescate"],
                tiempo_translado: 15,
                kilometros_recorridos: 5.2,
                dictamen: "Paciente con traumatismo craneoencefálico moderado, estabilizado y trasladado",
                trabaja_realizado: ["Inmovilización cervical", "Vendaje de heridas", "Traslado a hospital"],
                nombres_afectados: ["Roberto Gómez Pérez"],
                dependencias_participantes: ["Policía Federal", "Tránsito CDMX"],
                observaciones: "Accidente vehicular, choque múltiple. Paciente consciente al arribo.",
                otros: "Clima despejado, tráfico intenso",
                createdBy: null,
                usuario_reportando: "Carlos Hernández López",
                turno: 0,
                createdAt: new Date("2025-01-15T11:00:00"),
            },
        ];

        const randomReports = Array.from({length: 25}).map((_, i) => {
            const fecha = faker.date.between({
                from: "2025-01-10T00:00:00Z",
                to: "2025-02-01T00:00:00Z",
            });
            return {
                folio: 1006 + i,
                tiempo_fecha: fecha.toISOString(),
                tiempo_fecha_atencion: new Date(fecha.getTime() + 10 * 60000).toISOString(),
                ubi: faker.location.streetAddress({useFullAddress: true}) + ", Cuajimalpa, CDMX",
                codigoPostal: faker.location.zipCode("05###"),
                modo_de_activacion: faker.helpers.arrayElement(["C3", "C4", "C5", "Policía", "Directo"]),
                gravedad_emergencia: faker.number.int({min: 0, max: 2}),
                tipo_servicio: faker.helpers.arrayElements(
                    ["accidente", "rescate", "Emergencia médica", "incendio", "traslado", "apoyo vial"],
                    faker.number.int({min: 1, max: 2})
                ),
                tiempo_translado: faker.number.int({min: 5, max: 30}),
                kilometros_recorridos: faker.number.float({min: 1, max: 12, precision: 0.1}),
                dictamen: faker.lorem.sentence(8),
                trabaja_realizado: faker.helpers.arrayElements(
                    [
                        "RCP básico",
                        "Inmovilización",
                        "Control de hemorragias",
                        "Traslado a hospital",
                        "Apoyo vial",
                        "Control de incendio",
                    ],
                    faker.number.int({min: 1, max: 3})
                ),
                nombres_afectados: faker.helpers.arrayElements(
                    [faker.person.fullName(), faker.person.fullName()],
                    faker.number.int({min: 0, max: 2})
                ),
                dependencias_participantes: faker.helpers.arrayElements(
                    ["Policía Federal", "Tránsito CDMX", "Protección Civil", "Cruz Roja", "Bomberos Cuajimalpa"],
                    faker.number.int({min: 1, max: 3})
                ),
                observaciones: faker.lorem.sentence(10),
                otros: faker.lorem.sentence(5),
                createdBy: null,
                usuario_reportando: faker.helpers.arrayElement(userNames),
                turno: faker.number.int({min: 0, max: 5}),
                createdAt: new Date(fecha.getTime() + 15 * 60000),
            };
        });

        await db.collection("reports").insertMany([...baseReports, ...randomReports]);
        console.log("Dummy reports created:", baseReports.length + randomReports.length);
    }
}

export { seedDatabase };
