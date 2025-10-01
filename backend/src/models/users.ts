interface User {
    id: number;
    nombre: string;
    apellidos: string;
    fecha_nacimiento: string;
    fecha_registro: string;
    telefono: string;
    correo_electronico: string;
    password: string;
    curp: string;
    direccion: string;
    agregado_por: number;
    eliminado_por: number | null;
    rol: string;
    permissions: string[];
}
