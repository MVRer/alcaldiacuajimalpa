import { Create, FormTab, TextInput, TabbedForm, SelectInput, SelectArrayInput, List, Datagrid, TextField, Show, SimpleShowLayout, Edit, FormDataConsumer, required, minLength, ArrayField, SingleFieldList, ChipField } from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";

const rolePermissions: { [key: string]: string[] } = {
    admin: ['*'],
    turnchief: ['view_turn_reports', 'view_turn_users'],
    paramedic: ['view_my_reports', 'create_reports']
};

const allPermissions = [
    { id: '*', name: 'Todos los permisos (Admin)' },
    { id: 'view_reports', name: 'Ver todos los reportes' },
    { id: 'create_reports', name: 'Crear reportes' },
    { id: 'edit_reports', name: 'Editar reportes' },
    { id: 'delete_reports', name: 'Eliminar reportes' },
    { id: 'view_my_reports', name: 'Ver mis reportes' },
    { id: 'view_turn_reports', name: 'Ver reportes de mi turno' },
    { id: 'view_users', name: 'Ver todos los usuarios' },
    { id: 'create_users', name: 'Crear usuarios' },
    { id: 'edit_users', name: 'Editar usuarios' },
    { id: 'delete_users', name: 'Eliminar usuarios' },
    { id: 'view_turn_users', name: 'Ver usuarios de mi turno' }
];

const AutoFillPermissions = () => {
    const role = useWatch({ name: 'role' });
    const { setValue } = useFormContext();

    useEffect(() => {
        if (role && rolePermissions[role]) {
            setValue('permissions', rolePermissions[role]);
        }
    }, [role, setValue]);

    return null;
};

export const UserCreate = () => (
    <Create>
        <TabbedForm>
            <FormTab label="Datos Personales">
                <TextInput source="nombre" label="Nombre(s)" validate={[required()]} />
                <TextInput source="apellidos" label="Apellidos" validate={[required()]} />
                <TextInput source="fecha_nacimiento" label="Fecha de Nacimiento" />
                <TextInput source="telefono" label="Telefono" type="phone" />
                <TextInput source="correo_electronico" label="Correo Electronico" type="email" validate={[required()]} />
                <TextInput source="curp" label="CURP" />
                <TextInput source="direccion" label="Direccion" multiline={true} />
                <TextInput source="contrasenia" label="Contraseña" type="password" validate={[required()]} />
            </FormTab>
            <FormTab label="Configuracion de Usuario">
                <AutoFillPermissions />
                <SelectInput source="role" label="Rol" choices={[
                    { id: 'admin', name: 'Administrador' },
                    { id: 'turnchief', name: 'Jefe de Turno' },
                    { id: 'paramedic', name: 'Paramedico' },
                ]} validate={[required()]} />
                <SelectArrayInput
                    source="permissions"
                    label="Permisos"
                    choices={allPermissions}
                    validate={[required(), minLength(1)]}
                />
                <SelectArrayInput source="turnos" choices={[
                    { id: 'LV-8am3pm', name: 'Lunes y viernes 8:00am - 3:00pm' },
                    { id: 'LV-3pm9pm', name: 'Lunes y viernes 3:00pm - 9:00pm' },
                    { id: 'LMV-9pm8am', name: 'Lunes, miercoles y viernes 9:00pm - 8:00am' },
                    { id: 'MJD-9pm-8am', name: 'Martes, jueces y domingo 9:00pm - 8:00am' },
                    { id: 'SDF-8am-9pm', name: 'Sabado, domingo y festivos 8:00am - 9:00pm' },
                    { id: 'SDF-8pm-8am', name: 'Sabado, domingo y festivos 8:00pm - 8:00am' },
                ]} validate={[required(), minLength(1)]} />

            </FormTab>
        </TabbedForm>
    </Create>
);
export const UserEdit= () => (
    <Edit>
        <TabbedForm>
            <FormTab label="Datos Personales">
                <TextInput source="nombre" label="Nombre(s)" validate={[required()]} />
                <TextInput source="apellidos" label="Apellidos" validate={[required()]} />
                <TextInput source="fecha_nacimiento" label="Fecha de Nacimiento" />
                <TextInput source="telefono" label="Telefono" type="phone" />
                <TextInput source="correo_electronico" label="Correo Electronico" type="email" validate={[required()]} />
                <TextInput source="curp" label="CURP" />
                <TextInput source="direccion" label="Direccion" multiline={true} />
                <TextInput source="contrasenia" label="Contraseña" type="password" />
            </FormTab>
            <FormTab label="Configuracion de Usuario">
                <AutoFillPermissions />
                <SelectInput source="role" label="Rol" choices={[
                    { id: 'admin', name: 'Administrador' },
                    { id: 'turnchief', name: 'Jefe de Turno' },
                    { id: 'paramedic', name: 'Paramedico' },
                ]} validate={[required()]} />
                <SelectArrayInput
                    source="permissions"
                    label="Permisos"
                    choices={allPermissions}
                    validate={[required(), minLength(1)]}
                />
                <SelectArrayInput source="turnos" choices={[
                    { id: 'LV-8am3pm', name: 'Lunes y viernes 8:00am - 3:00pm' },
                    { id: 'LV-3pm9pm', name: 'Lunes y viernes 3:00pm - 9:00pm' },
                    { id: 'LMV-9pm8am', name: 'Lunes, miercoles y viernes 9:00pm - 8:00am' },
                    { id: 'MJD-9pm-8am', name: 'Martes, jueces y domingo 9:00pm - 8:00am' },
                    { id: 'SDF-8am-9pm', name: 'Sabado, domingo y festivos 8:00am - 9:00pm' },
                    { id: 'SDF-8pm-8am', name: 'Sabado, domingo y festivos 8:00pm - 8:00am' },
                ]} validate={[required(), minLength(1)]} />

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
            <TextField source="role" label="Rol" />
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
            <TextField source="role" label="Rol" />
            <ArrayField source="turnos" label="Turnos">
                <SingleFieldList>
                    <ChipField source="$self" />
                </SingleFieldList>
            </ArrayField>
            <TextField source="fecha_nacimiento" label="Fecha de Nacimiento" />
            <TextField source="curp" label="CURP" />
            <TextField source="direccion" label="Direccion" />
            <TextField source="agregado_por" label="Agregado Por (ID)" />
        </SimpleShowLayout>
    </Show>
);