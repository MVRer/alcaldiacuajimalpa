import { useCanAccess, Create, SimpleForm, TextInput } from "react-admin";

export const ReportCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Nombre" />
    </SimpleForm>
  </Create>
);
