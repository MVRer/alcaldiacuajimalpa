import { z } from "zod";
import { ObjectId } from "mongodb";

const reportSchema = z.object({
    folio: z.string().min(1, "Folio is required"),

    tiempo_fecha: z.coerce.date(),
    tiempo_fecha_atencion: z.coerce.date(),

    ubi: z.string().min(2, "Ubicación is required"),
    codigoPostal: z
        .string()
        .regex(/^\d{5}$/, "Invalid postal code")
        .optional(),

    modo_de_activacion: z.string().min(1, "Modo de activación is required"),
    gravedad_emergencia: z.coerce.number().nonnegative(),

    tipo_servicio: z
        .array(z.string().min(1, "Tipo de servicio is required"))
        .nonempty("At least one tipo_servicio is required"),

    tiempo_translado: z.coerce.number().nonnegative().optional(),
    kilometros_recorridos: z.coerce.number().nonnegative().optional(),

    dictamen: z.string().min(1, "Dictamen is required"),

    trabaja_realizado: z
        .array(
            z.object({
                trabajo: z.string().min(1, "Trabajo realizado is required"),
            }),
        )
        .default([]),

    nombres_afectados: z
        .array(
            z.object({
                nombre: z.string().min(1, "Nombre is required"),
            }),
        )
        .default([]),

    dependencias_participantes: z
        .array(
            z.object({
                dependencia: z.string().min(1, "Dependencia is required"),
            }),
        )
        .default([]),

    observaciones: z.string().optional(),
    otros: z.string().optional(),

    createdBy: z.instanceof(ObjectId),
    usuario_reportando: z.string().min(1, "Usuario reportando is required"),
    turno: z.union([z.string(), z.array(z.string())]).optional(),
    createdAt: z.coerce.date(),
});

export default reportSchema;