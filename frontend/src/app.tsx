import { Admin, Resource, ListGuesser } from "react-admin";
import { authProvider } from "./providers/auth/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { i18nProvider } from "./providers/i18nProvider";

import { Dashboard } from "./dashboard";

import AbcIcon from "@mui/icons-material/Abc";


import { CreateMyReport, MyReportList } from "./resources/myReport";
import { UserCreate, UserEdit, UserList, UserShow } from "./resources/user";
import { SubordinadoShow, SubordinadosList } from "./resources/subordinados";

export const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    dashboard={Dashboard}
  >
    <Resource
      name="reports"
      recordRepresentation="Mis reportes"
      options={{ label: "Mis Reportes" }}
      icon={AbcIcon}
      list={MyReportList}
      // edit={}
      create={CreateMyReport}
      // show={}
    />
    <Resource
      name="users"
      recordRepresentation="Usuarios"
      options={{ label: "Usuarios" }}
      icon={AbcIcon}
      list={UserList}
      edit={UserEdit}
      create={UserCreate}
      show={UserShow}
    />
    {/* TODO: Add backend routes for these resources */}
    {/* <Resource
      name="turnos"
      recordRepresentation={(turn) => `Turno: ${turn.schedule}`}
      options={{ label: "Turnos" }}
      icon={AbcIcon}
      list={ListGuesser}
    /> */}
    {/* <Resource
      name="usuariossubordinados"
      recordRepresentation={(subordinado) => `${subordinado.nombre} ${subordinado.apellidos}`}
      options={{ label: "Subordinados" }}
      icon={AbcIcon}
      list={SubordinadosList}
      show={SubordinadoShow}
    /> */}
  </Admin>
);

// <Resource
//   name="hellos" // match backend entity name (plural)
//   recordRepresentation="superHello" // Defines how to represent a record in titles or dropdowns.
//   options={{
//     label: "hola", // Hello but in es
//     hideFromSideBar: false, // uk
//   }}
//   icon={AbcIcon} // Icon
// //   list={} // Read
// //   edit={} // Edir Update Delete
// //   create={} // create
// //   show={} // Read details
// />
