import { TextField, List, Datagrid, Show, SimpleShowLayout } from "react-admin";


export const SubordinadosList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="nombre" label="Nombre" />
            <TextField source="apellidos" label="Apellidos" />
            <TextField source="telefono" label="Telefono" />
            <TextField source="correo_electronico" label="Correo Electronico" />
            <TextField source="turno" label="Turno" />
        </Datagrid>
    </List>
);

export const SubordinadoShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="nombre" label="Nombre" />
            <TextField source="apellidos" label="Apellidos" />
            <TextField source="telefono" label="Telefono"/>
            <TextField source="correo_electronico" label="Correo Electronico"/>
            <TextField source="turno" label="Turno" />
        </SimpleShowLayout>
    </Show>
);
