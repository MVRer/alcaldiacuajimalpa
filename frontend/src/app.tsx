import { Admin, Resource, usePermissions } from "react-admin";
import { authProvider } from "./providers/auth/authProvider";
import { dataProvider } from "./providers/dataProvider";
import { i18nProvider } from "./providers/i18nProvider";
import { Dashboard } from "./dashboard";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import GroupIcon from "@mui/icons-material/Group";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

import {
  CreateMyReport,
  MyReportList,
  MyReportShow,
} from "./resources/myReport";
import { UserCreate, UserEdit, UserList, UserShow } from "./resources/user";
import { SubordinadoShow, SubordinadosList } from "./resources/subordinados";

import layout from "./layout";
import loginPage from "./login.tsx";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

export const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={i18nProvider}
    dashboard={Dashboard}
    layout={layout}
    loginPage={loginPage}
    theme={theme}
  >
    {(permissions: string[]) => {
      const isAdmin = permissions?.includes("*");

      const resources = [];

      if (isAdmin || permissions?.includes("view_my_reports")) {
        resources.push(
          <Resource
            key="my-reports"
            name="my-reports"
            recordRepresentation="Mis reportes"
            options={{ label: "Mis Reportes" }}
            icon={AssignmentIndIcon}
            list={MyReportList}
            create={CreateMyReport}
            show={MyReportShow}
          />,
        );
      }

      if (isAdmin || permissions?.includes("view_reports")) {
        resources.push(
          <Resource
            key="reports"
            name="reports"
            recordRepresentation="Todos los reportes"
            options={{ label: "Todos los Reportes" }}
            icon={AssessmentIcon}
            list={MyReportList}
            show={MyReportShow}
          />,
        );
      }

      if (isAdmin || permissions?.includes("view_turn_reports")) {
        resources.push(
          <Resource
            key="turn-reports"
            name="turn-reports"
            recordRepresentation="Reportes de mi turno"
            options={{ label: "Reportes de Mi Turno" }}
            icon={ScheduleIcon}
            list={MyReportList}
            show={MyReportShow}
          />,
        );
      }

      if (isAdmin || permissions?.includes("view_users")) {
        resources.push(
          <Resource
            key="users"
            name="users"
            recordRepresentation="Usuarios"
            options={{ label: "Usuarios" }}
            icon={GroupIcon}
            list={UserList}
            edit={UserEdit}
            create={UserCreate}
            show={UserShow}
          />,
        );
      }

      if (isAdmin || permissions?.includes("view_turn_users")) {
        resources.push(
          <Resource
            key="turn-users"
            name="turn-users"
            recordRepresentation="Usuarios de mi turno"
            options={{ label: "Usuarios de Mi Turno" }}
            icon={SupervisedUserCircleIcon}
            list={SubordinadosList}
            show={SubordinadoShow}
          />,
        );
      }

      return resources;
    }}
  </Admin>
);
