import fakeDataProvider from "ra-data-fakerest";

const data = {
  "mis-reportes": [
    {
      folio: 1,
      tiempo_fecha: "00-00-00THH:MM:DD",
      turno: 0,
      usuario_reportando: "",
      modo_de_activacion: "",
      tipo_servicio: [],
      tiempo_fecha_atencion: "00-00-00THH:MM:DD",
      tiempo_translado: 0,
      gravedad_emergencia: 0, // [0, 1, 2]
      kilometros_recorridos: 0,
      trabaja_realizado: "",
      observaciones: {},
      dictamen: "",
      nombres_afectados: [],
      dependencias_participantes: [],
      ubi: "",
      codigoPostal: "",
      otros: {},
    },
  ],
  reportes: [
    {
      folio: 1,
      tiempo_fecha: "00-00-00THH:MM:DD",
      turno: 0,
      usuario_reportando: "",
      modo_de_activacion: "",
      tipo_servicio: [],
      tiempo_fecha_atencion: "00-00-00THH:MM:DD",
      tiempo_translado: 0,
      gravedad_emergencia: 0, // [0, 1, 2]
      kilometros_recorridos: 0,
      trabaja_realizado: "",
      observaciones: {},
      dictamen: "",
      nombres_afectados: [],
      dependencias_participantes: [],
      ubi: "",
      codigoPostal: "",
      otros: {},
    },
  ],
  usuarios: [
    {
      nombre: "Alice",
      apellidos: "Mamota",
      fecha_nacimiento: "00-00-00",
      fecha_registro: "00-00-00",
      telefono: "5555555555",
      correo_electronico: "alice@example.com",
      curp: "AAAA000000AAAAAA00",
      direccion: "Calle Falsa 123, Ciudad, Pais",
      agregado_por: 0,
      eliminado_por: null,
      rol: "paramédico",
    },
  ],
  usuariossubordinados: [
    {
      nombre: "Alice",
      apellidos: "Mamota",
      fecha_nacimiento: "00-00-00",
      fecha_registro: "00-00-00",
      telefono: "5555555555",
      correo_electronico: "alice@example.com",
      turno: "LV-8am3pm",
      agregado_por: 0,
    },
  ],
  turnos: [
    { schedule: "Lun,vie	8-3" },
    { schedule: "Lun,vie	3-9pm" },
    { schedule: "Lun,mie,vie	9pm-8am" },
    { schedule: "Mar,jue,dom	9pm-8am" },
    { schedule: "Sab,dom,fest	8am-8pm" },
    { schedule: "Sab,dom,fest	8pm-8am" },
  ],
};

export const dataProvider = fakeDataProvider(data, true);
