import { Admin, Resource, ListGuesser, CustomRoutes } from "react-admin";
import { authProvider } from "./providers/auth/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { i18nProvider } from "./providers/i18nProvider";

import { Dashboard } from "./dashboard";

import AbcIcon from "@mui/icons-material/Abc";


import { CreateMyReport, MyReportList, MyReportShow } from "./resources/myReport";
import { UserCreate, UserEdit, UserList, UserShow } from "./resources/user";
import { SubordinadoShow, SubordinadosList } from "./resources/subordinados";

export const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    dashboard={Dashboard}
  >
    {(permissions: string[]) => {
      const isAdmin = permissions?.includes('*');
      return [
        (isAdmin || permissions?.includes('view_my_reports')) && (
          <Resource
            key="my-reports"
            name="my-reports"
            recordRepresentation="Mis reportes"
            options={{ label: "Mis Reportes" }}
            icon={AbcIcon}
            list={MyReportList}
            create={CreateMyReport}
            show={MyReportShow}
          />
        ),
        (isAdmin || permissions?.includes('view_reports')) && (
          <Resource
            key="reports"
            name="reports"
            recordRepresentation="Todos los reportes"
            options={{ label: "Todos los Reportes" }}
            icon={AbcIcon}
            list={MyReportList}
            show={MyReportShow}
          />
        ),
        (isAdmin || permissions?.includes('view_turn_reports')) && (
          <Resource
            key="turn-reports"
            name="turn-reports"
            recordRepresentation="Reportes de mi turno"
            options={{ label: "Reportes de Mi Turno" }}
            icon={AbcIcon}
            list={MyReportList}
            show={MyReportShow}
          />
        ),
        (isAdmin || permissions?.includes('view_users')) && (
          <Resource
            key="users"
            name="users"
            recordRepresentation="Usuarios"
            options={{ label: "Usuarios" }}
            icon={AbcIcon}
            list={UserList}
            edit={UserEdit}
            create={UserCreate}
            show={UserShow}
          />
        ),
      ];
    }}
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
