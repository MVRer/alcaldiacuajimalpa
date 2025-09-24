// src/dataProvider.ts
import fakeDataProvider from "ra-data-fakerest";

const data = {
  "mis-reportes": [
    {
      id: 1,
      title: "Mi reporte 1",
      description: "Fuga de agua",
      user_id: 1,
      turn: 1,
    },
    {
      id: 2,
      title: "Mi reporte 2",
      description: "Incendio leve",
      user_id: 2,
      turn: 2,
    },
  ],
  reportes: [
    { id: 1, turn: "Mañana", detail: "Choque en avenida", user_id: 1 },
    { id: 2, turn: "Noche", detail: "Accidente doméstico", user_id: 3 },
    { id: 3, turn: "Tarde", detail: "Rescate animal", user_id: 2 },
  ],
  usuarios: [
    { id: 1, name: "Alice", role: "Paramédico" },
    { id: 2, name: "Bob", role: "Jefe de Turno" },
    { id: 3, name: "Carlos", role: "Administrador" },
  ],
  turnos: [
    { id: 1, schedule: "Mañana 7:00 - 15:00" },
    { id: 2, schedule: "Tarde 15:00 - 23:00" },
    { id: 3, schedule: "Noche 23:00 - 7:00" },
  ],
};

export const dataProvider = fakeDataProvider(data, true);
