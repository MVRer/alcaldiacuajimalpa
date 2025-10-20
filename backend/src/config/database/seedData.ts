const bcrypt = require('bcrypt');

async function seedDatabase(db: any) {
    const saltRounds = parseInt(process.env.SALT_ROUNDS || "10");

    const defaultUser = "admin@paramedia.com";
    const defaultPassword = "admin123";

    const existingUser = await db.collection('users').findOne({ correo_electronico: defaultUser });

    if (!existingUser) {
        await db.collection('users').insertOne({
            nombre: "Admin",
            apellidos: "Sistema",
            fecha_nacimiento: "1990-01-01",
            fecha_registro: new Date().toISOString().split('T')[0],
            telefono: "5555555555",
            correo_electronico: defaultUser,
            password: await bcrypt.hash(defaultPassword, saltRounds),
            curp: "ADSI900101HDFLNS00",
            direccion: "Av. Stim 1321, Lomas de Vista Hermosa, Cuajimalpa, CDMX",
            agregado_por: null,
            eliminado_por: null,
            role: "admin",
            turnos: [],
            permissions: ['*'],
        });
        console.log('Default admin user created:', defaultUser, '/', defaultPassword);
    } else {
        console.log('Default admin user already exists');
    }

    const existingUsers = await db.collection('users').countDocuments();
    if (existingUsers === 1) {
        const dummyUsers = [
            {
                nombre: "Carlos",
                apellidos: "Hernández López",
                fecha_nacimiento: "1988-05-15",
                fecha_registro: new Date().toISOString().split('T')[0],
                telefono: "5551234567",
                correo_electronico: "carlos.hernandez@paramedia.com",
                password: await bcrypt.hash("password123", saltRounds),
                curp: "HELC880515HDFPRR01",
                direccion: "Av. Observatorio 100, Cuajimalpa, CDMX",
                agregado_por: null,
                eliminado_por: null,
                role: "turnchief",
                turnos: ["LV-8am3pm", "LV-3pm9pm"],
                permissions: ['view_turn_reports', 'view_turn_users'],
            },
            {
                nombre: "María",
                apellidos: "García Ramírez",
                fecha_nacimiento: "1992-08-22",
                fecha_registro: new Date().toISOString().split('T')[0],
                telefono: "5559876543",
                correo_electronico: "maria.garcia@paramedia.com",
                password: await bcrypt.hash("password123", saltRounds),
                curp: "GARM920822MDFRMR08",
                direccion: "Camino al Olivo 56, Contadero, Cuajimalpa, CDMX",
                agregado_por: null,
                eliminado_por: null,
                role: "paramedic",
                turnos: ["LV-8am3pm", "LMV-9pm8am"],
                permissions: ['view_my_reports', 'create_reports'],
            },
            {
                nombre: "José Luis",
                apellidos: "Martínez Sánchez",
                fecha_nacimiento: "1985-03-10",
                fecha_registro: new Date().toISOString().split('T')[0],
                telefono: "5556789012",
                correo_electronico: "jose.martinez@paramedia.com",
                password: await bcrypt.hash("password123", saltRounds),
                curp: "MASJ850310HDFRNL04",
                direccion: "Av. Bosques 234, Bosques de las Lomas, Cuajimalpa, CDMX",
                agregado_por: null,
                eliminado_por: null,
                role: "paramedic",
                turnos: ["MJD-9pm-8am", "SDF-8am-9pm"],
                permissions: ['view_my_reports', 'create_reports'],
            }
        ];
        await db.collection('users').insertMany(dummyUsers);
        console.log('Dummy users created');
    }

    const existingReports = await db.collection('reports').countDocuments();
    if (existingReports === 0) {
        const dummyReports = [
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
                createdAt: new Date("2025-01-15T11:00:00")
            },
            {
                folio: 1002,
                tiempo_fecha: "2025-01-16T03:20:00",
                tiempo_fecha_atencion: "2025-01-16T03:35:00",
                ubi: "Camino Real a Toluca 302, San José de los Cedros, Cuajimalpa, CDMX",
                codigoPostal: "05200",
                modo_de_activacion: "C3",
                gravedad_emergencia: 1,
                tipo_servicio: ["incendio"],
                tiempo_translado: 12,
                kilometros_recorridos: 4.8,
                dictamen: "Incendio menor en vehículo estacionado, controlado sin lesionados",
                trabaja_realizado: ["Control de incendio", "Revisión de zona", "Acordonamiento"],
                nombres_afectados: [],
                dependencias_participantes: ["Bomberos Cuajimalpa", "Protección Civil"],
                observaciones: "Fuego en compartimento de motor, sin propagación",
                otros: "Vehículo marca Nissan, modelo 2015",
                createdBy: null,
                usuario_reportando: "María García Ramírez",
                turno: 2,
                createdAt: new Date("2025-01-16T04:00:00")
            },
            {
                folio: 1003,
                tiempo_fecha: "2025-01-17T14:00:00",
                tiempo_fecha_atencion: "2025-01-17T14:20:00",
                ubi: "Parque Nacional Desierto de los Leones, Cuajimalpa, CDMX",
                codigoPostal: "05000",
                modo_de_activacion: "Directo",
                gravedad_emergencia: 1,
                tipo_servicio: ["rescate"],
                tiempo_translado: 25,
                kilometros_recorridos: 8.5,
                dictamen: "Rescate de ciclista con fractura en pierna derecha",
                trabaja_realizado: ["Evaluación primaria", "Inmovilización de extremidad", "Traslado en camilla"],
                nombres_afectados: ["Ana María Torres"],
                dependencias_participantes: ["Policía Turística", "Cruz Roja"],
                observaciones: "Caída en zona boscosa durante actividad recreativa",
                otros: "Zona de difícil acceso, se utilizó equipo especial",
                createdBy: null,
                usuario_reportando: "José Luis Martínez Sánchez",
                turno: 4,
                createdAt: new Date("2025-01-17T15:00:00")
            },
            {
                folio: 1004,
                tiempo_fecha: "2025-01-18T22:15:00",
                tiempo_fecha_atencion: "2025-01-18T22:30:00",
                ubi: "Av. Stim 1000, Lomas de Vista Hermosa, Cuajimalpa, CDMX",
                codigoPostal: "05100",
                modo_de_activacion: "Policia",
                gravedad_emergencia: 0,
                tipo_servicio: ["accidente"],
                tiempo_translado: 8,
                kilometros_recorridos: 3.2,
                dictamen: "Accidente menor sin lesionados, solo daños materiales",
                trabaja_realizado: ["Revisión de involucrados", "Apoyo vial"],
                nombres_afectados: [],
                dependencias_participantes: ["Tránsito CDMX"],
                observaciones: "Colisión lateral a baja velocidad, conductores ilesos",
                otros: "",
                createdBy: null,
                usuario_reportando: "Carlos Hernández López",
                turno: 1,
                createdAt: new Date("2025-01-18T23:00:00")
            },
            {
                folio: 1005,
                tiempo_fecha: "2025-01-19T08:45:00",
                tiempo_fecha_atencion: "2025-01-19T09:00:00",
                ubi: "Av. Constituyentes 900, El Contadero, Cuajimalpa, CDMX",
                codigoPostal: "05500",
                modo_de_activacion: "C5",
                gravedad_emergencia: 2,
                tipo_servicio: ["accidente", "Emergencia médica"],
                tiempo_translado: 18,
                kilometros_recorridos: 6.7,
                dictamen: "Atropellamiento de peatón, paciente con politraumatismos graves",
                trabaja_realizado: ["RCP básico", "Control de hemorragias", "Inmovilización total", "Traslado urgente"],
                nombres_afectados: ["Pedro Ramírez Castillo"],
                dependencias_participantes: ["Policía Federal", "Ministerio Público", "Hospital ABC"],
                observaciones: "Paciente crítico, traslado código rojo al hospital más cercano",
                otros: "Conductor se dio a la fuga, se notificó a autoridades",
                createdBy: null,
                usuario_reportando: "María García Ramírez",
                turno: 0,
                createdAt: new Date("2025-01-19T09:30:00")
            }
        ];
        await db.collection('reports').insertMany(dummyReports);
        console.log('Dummy reports created');
    }
}

module.exports = { seedDatabase };
