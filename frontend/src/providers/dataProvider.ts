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
      otros: {},
    },
  ],
  usuarios: [
    {
      nombre: "Alice",
      apellido: "Alice",
      fecha_nacimiento: "00-00-00",
      fecha_registro: "00-00-00",
      agregado_por: 0,
      eliminado_por: null,
      role: "paramédico",
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
