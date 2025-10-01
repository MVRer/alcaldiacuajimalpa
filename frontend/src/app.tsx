import { Admin, Resource, ListGuesser } from "react-admin";
import { authProvider } from "./providers/auth/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { i18nProvider } from "./providers/i18nProvider";

import { Dashboard } from "./dashboard";

import AbcIcon from "@mui/icons-material/Abc";

import { CreateMyReport, MyReportList } from "./resources/myReport";

export const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    dashboard={Dashboard}
  >
    <Resource
      name="mis-reportes"
      recordRepresentation="Mis reports"
      options={{ label: "Mis Reporter" }}
      icon={AbcIcon}
      list={MyReportList}
      // edit={}
      create={CreateMyReport}
      // show={}
    />
    <Resource
      name="reportes"
      recordRepresentation={(report) => `${report.turn}`}
      options={{ label: "Reporter" }}
      icon={AbcIcon}
      list={ListGuesser}
      // edit={}
      // create={}
      // show={}
    />
    <Resource
      name="usuarios"
      recordRepresentation="Usuarios"
      options={{ label: "Usuarios" }}
      icon={AbcIcon}
      list={ListGuesser}
      // edit={}
      // create={}
      // show={}
    />
    <Resource
      name="turnos"
      recordRepresentation={(turn) => `Turno: ${turn.schedule}`}
      options={{ label: "Turnos" }}
      icon={AbcIcon}
      list={ListGuesser}
      // edit={}
      // create={}
      // show={}
    />
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
