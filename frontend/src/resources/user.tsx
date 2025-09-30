import { Create, FormTab, TextInput, TabbedForm, SelectInput, SelectArrayInput, List, Datagrid, TextField, Show, SimpleShowLayout, Edit } from "react-admin";

export const UserCreate = () => (
    <Create>
        <TabbedForm>
            <FormTab label="Datos Personales">
                <TextInput source="nombre" label="Nombre(s)" />
                <TextInput source="apellidos" label="Apellidos" />
                <TextInput source="fecha_nacimiento" label="Fecha de Nacimiento" />
                <TextInput source="telefono" label="Telefono" type="phone" />
                <TextInput source="correo_electronico" label="Correo Electronico" type="email" />
                <TextInput source="curp" label="CURP" />
                <TextInput source="direccion" label="Direccion" multiline={true} />
                <TextInput source="contrasenia" label="Contraseña" type="password" />
            </FormTab>
            <FormTab label="Configuracion de Usuario">
                <SelectInput source="role" label="Rol" choices={[
                    { id: 'admin', name: 'Administrador' },
                    { id: 'turnchief', name: 'Jefe de Turno' },
                    { id: 'paramedic', name: 'Paramedico' },
                ]} />
                <SelectArrayInput source="turnos" choices={[
                    { id: 'LV-8am3pm', name: 'Lunes y viernes 8:00am - 3:00pm' },
                    { id: 'LV-3pm9pm', name: 'Lunes y viernes 3:00pm - 9:00pm' },
                    { id: 'LMV-9pm8am', name: 'Lunes, miercoles y viernes 9:00pm - 8:00am' },
                    { id: 'MJD-9pm-8am', name: 'Martes, jueces y domingo 9:00pm - 8:00am' },
                    { id: 'SDF-8am-9pm', name: 'Sabado, domingo y festivos 8:00am - 9:00pm' },
                    { id: 'SDF-8pm-8am', name: 'Sabado, domingo y festivos 8:00pm - 8:00am' },
                ]} />

            </FormTab>
        </TabbedForm>
    </Create>
);
export const UserEdit= () => (
    <Edit>
        <TabbedForm>
            <FormTab label="Datos Personales">
                <TextInput source="nombre" label="Nombre(s)" />
                <TextInput source="apellidos" label="Apellidos" />
                <TextInput source="fecha_nacimiento" label="Fecha de Nacimiento" />
                <TextInput source="telefono" label="Telefono" type="phone" />
                <TextInput source="correo_electronico" label="Correo Electronico" type="email" />
                <TextInput source="curp" label="CURP" />
                <TextInput source="direccion" label="Direccion" multiline={true} />
                <TextInput source="contrasenia" label="Contraseña" type="password" />
            </FormTab>
            <FormTab label="Configuracion de Usuario">
                <SelectInput source="role" label="Rol" choices={[
                    { id: 'admin', name: 'Administrador' },
                    { id: 'turnchief', name: 'Jefe de Turno' },
                    { id: 'paramedic', name: 'Paramedico' },
                ]} />
                <SelectArrayInput source="turnos" choices={[
                    { id: 'LV-8am3pm', name: 'Lunes y viernes 8:00am - 3:00pm' },
                    { id: 'LV-3pm9pm', name: 'Lunes y viernes 3:00pm - 9:00pm' },
                    { id: 'LMV-9pm8am', name: 'Lunes, miercoles y viernes 9:00pm - 8:00am' },
                    { id: 'MJD-9pm-8am', name: 'Martes, jueces y domingo 9:00pm - 8:00am' },
                    { id: 'SDF-8am-9pm', name: 'Sabado, domingo y festivos 8:00am - 9:00pm' },
                    { id: 'SDF-8pm-8am', name: 'Sabado, domingo y festivos 8:00pm - 8:00am' },
                ]} />

            </FormTab>
        </TabbedForm>
    </Edit>
);



export const UserList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="nombre" label="Nombre(s)" />
            <TextField source="apellidos" label="Apellidos" />
            <TextField source="telefono" label="Telefono" />
            <TextField source="rol" label="Rol" />
            <TextField source="correo_electronico" label="Correo Electronico" />
            <TextField source="fecha_nacimiento" label="Fecha de Nacimiento" />
        </Datagrid>
    </List>
);

export const UserShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="nombre" label="Nombre(s)" />
            <TextField source="apellidos" label="Apellidos" />
            <TextField source="telefono" label="Telefono"/>
            <TextField source="correo_electronico" label="Correo Electronico"/>
            <TextField source="rol" label="Rol" />
            <TextField source="fecha_nacimiento" label="Fecha de Nacimiento" />
            <TextField source="curp" label="CURP" />
            <TextField source="direccion" label="Direccion" />
            <TextField source="agregado_por" label="Agregado Por (ID)" />
        

        </SimpleShowLayout>
        
    </Show>
    
);