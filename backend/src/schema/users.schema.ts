import { z } from "zod";


const UserSchema = z.object({
    id: z.number(),
    nombre: z.string(),
    apellidos: z.string(),
    fecha_nacimiento: z.string(),  // could use z.string().date() if normalize date format
    fecha_registro: z.string(),
    telefono: z.string(),
    correo_electronico: z.string().email(),
    password: z.string(),
    curp: z.string().length(18),
    direccion: z.string(),
    agregado_por: z.number(),
    eliminado_por: z.number().nullable(),
    rol: z.string(),
    permissions: z.array(z.string()),
});


export type User = z.infer<typeof UserSchema>;
export default UserSchema;