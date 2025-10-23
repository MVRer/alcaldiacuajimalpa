import * as React from "react";
import {
  Create,
  SimpleForm,
  NumberInput,
  DateTimeInput,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  useGetIdentity,
  FormDataConsumer,
  required,
  minLength,
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ArrayField,
  SingleFieldList,
  ChipField,
  Show,
  SimpleShowLayout,
  TopToolbar,
  ExportButton,
  CreateButton,
} from "react-admin";
import { Box, Typography, Divider } from "@mui/material";

const gravedadChoices = [
  { id: 0, name: "Baja" },
  { id: 1, name: "Media" },
  { id: 2, name: "Alta" },
];

const reportWayChoices = [
  { id: "C5", name: "C5" },
  { id: "C3", name: "C3" },
  { id: "Policia", name: "Policia" },
  { id: "Directo", name: "Directo" },
  { id: "otro", name: "Otro" },
];

const tipoServicioChoices = [
  { id: "incendio", name: "Incendio" },
  { id: "accidente", name: "Accidente" },
  { id: "rescate", name: "Rescate" },
  { id: "otro", name: "Otro (Especificar)" },
];

export const CreateMyReport = () => {
  const { data: identity, isLoading } = useGetIdentity();

  if (isLoading) return <p>Cargando...</p>;
  if (!identity) return <h2>No Logged in</h2>;

  const now = new Date().toISOString();

  return (
    <Create>
      <Box
        sx={{
          mb: 2,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Sesión Actual
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          <Typography variant="body1">
            <strong>Usuario:</strong> {identity.fullName || "N/D"}
          </Typography>
          <Typography variant="body1">
            <strong>Turno:</strong>{" "}
            {identity.turnos && identity.turnos.length > 0
              ? identity.turnos.join(", ")
              : "N/D"}
          </Typography>
        </Box>
      </Box>

      <SimpleForm
        defaultValues={{
          y: now,
          tiempo_fecha_atencion: now,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Identificación y Ubicación
        </Typography>
        <Box sx={{ display: { xs: "block", md: "flex" }, gap: 2 }}>
          <TextInput source="folio" label="Folio" validate={[required()]} />
          <DateTimeInput
            source="tiempo_fecha"
            label="Fecha y Hora del Reporte"
            validate={[required()]}
          />
          <TextInput source="codigoPostal" label="Codigo Postal" />
        </Box>

        <TextInput
          source="ubi"
          label="Ubicación"
          fullWidth
          validate={[required()]}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Detalles del Servicio
        </Typography>
        <Box sx={{ display: { xs: "block", md: "flex" }, gap: 2 }}>
          <SelectInput
            source="modo_de_activacion"
            label="Forma de reporte"
            choices={reportWayChoices}
            validate={[required()]}
          />
          <SelectInput
            source="gravedad_emergencia"
            label="Gravedad"
            choices={gravedadChoices}
          />
          <DateTimeInput
            source="tiempo_fecha_atencion"
            label="Hora de Atención"
          />
        </Box>

        <ArrayInput
          source="tipo_servicio"
          label="Tipo de Servicio"
          validate={[required(), minLength(1)]}
          format={(value) =>
            value ? value.map((item) => ({ tipo: item, otro: "" })) : []
          }
          parse={(value) =>
            value
              ? value.map((item) =>
                  item.tipo === "otro" && item.otro
                    ? item.otro.trim()
                    : item.tipo,
                )
              : []
          }
        >
          <SimpleFormIterator>
            <SelectInput source="tipo" choices={tipoServicioChoices} />
            <FormDataConsumer>
              {({ scopedFormData }) =>
                scopedFormData?.tipo === "otro" && (
                  <TextInput
                    source="otro"
                    label="Especificar otro"
                    sx={{ ml: 2 }}
                  />
                )
              }
            </FormDataConsumer>
          </SimpleFormIterator>
        </ArrayInput>

        <NumberInput
          source="tiempo_translado"
          label="Tiempo de Traslado (minutos)"
        />
        <NumberInput
          source="kilometros_recorridos"
          label="Kilómetros Recorridos"
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Resultados
        </Typography>
        <TextInput source="dictamen" label="Dictamen" multiline fullWidth />
        <ArrayInput
          source="trabaja_realizado"
          label="Trabajos Realizados"
          fullWidth
        >
          <SimpleFormIterator>
            <TextInput source="trabajo" label="Trabajo" />
          </SimpleFormIterator>
        </ArrayInput>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Personas y Dependencias
        </Typography>
        <ArrayInput source="nombres_afectados" label="Nombres Afectados">
          <SimpleFormIterator>
            <TextInput source="nombre" label="Nombre" />
          </SimpleFormIterator>
        </ArrayInput>

        <ArrayInput
          source="dependencias_participantes"
          label="Dependencias Participantes"
        >
          <SimpleFormIterator>
            <TextInput source="dependencia" label="Dependencia" />
          </SimpleFormIterator>
        </ArrayInput>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Otros
        </Typography>
        <TextInput
          source="observaciones"
          label="Observaciones"
          multiline
          fullWidth
        />
        <TextInput source="otros" label="Otros" multiline fullWidth />
      </SimpleForm>
    </Create>
  );
};

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

export const MyReportList = () => (
  <List actions={<ListActions />}>
    <Datagrid rowClick="show">
      <TextField source="folio" />
      <DateField source="tiempo_fecha" label="Fecha Reporte" showTime />
      <NumberField source="turno" />
      <TextField source="usuario_reportando" />
      <TextField source="modo_de_activacion" />

      <ArrayField source="tipo_servicio">
        <SingleFieldList>
          <ChipField source="" />
        </SingleFieldList>
      </ArrayField>

      <DateField
        source="tiempo_fecha_atencion"
        label="Fecha Atención"
        showTime
      />
      <NumberField source="tiempo_translado" label="Traslado (min)" />
      <NumberField source="gravedad_emergencia" />
      <NumberField source="kilometros_recorridos" />

      <TextField source="trabaja_realizado" />
      <TextField source="dictamen" />

      <ArrayField source="nombres_afectados">
        <SingleFieldList>
          <ChipField source="" />
        </SingleFieldList>
      </ArrayField>

      <ArrayField source="dependencias_participantes">
        <SingleFieldList>
          <ChipField source="" />
        </SingleFieldList>
      </ArrayField>

      <TextField source="ubi" />

      <TextField source="observaciones" />
      <TextField source="otros" />
    </Datagrid>
  </List>
);

export const MyReportShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="folio" label="Folio" />
      <DateField
        source="tiempo_fecha"
        label="Fecha y Hora del Reporte"
        showTime
      />
      <TextField source="ubi" label="Ubicación" />
      <TextField source="codigoPostal" label="Código Postal" />

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Detalles del Servicio
      </Typography>
      <TextField source="modo_de_activacion" label="Forma de reporte" />
      <NumberField source="gravedad_emergencia" label="Gravedad" />
      <ArrayField source="tipo_servicio" label="Tipo de Servicio">
        <SingleFieldList>
          <ChipField source="" />
        </SingleFieldList>
      </ArrayField>
      <DateField
        source="tiempo_fecha_atencion"
        label="Hora de Atención"
        showTime
      />
      <NumberField source="tiempo_translado" label="Tiempo de Traslado (min)" />
      <NumberField
        source="kilometros_recorridos"
        label="Kilómetros Recorridos"
      />

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Resultados
      </Typography>
      <TextField source="dictamen" label="Dictamen" />
      <ArrayField source="trabaja_realizado" label="Trabajos Realizados">
        <SingleFieldList>
          <ChipField source="trabajo" />
        </SingleFieldList>
      </ArrayField>

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Personas y Dependencias
      </Typography>
      <ArrayField source="nombres_afectados" label="Nombres Afectados">
        <SingleFieldList>
          <ChipField source="nombre" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField
        source="dependencias_participantes"
        label="Dependencias Participantes"
      >
        <SingleFieldList>
          <ChipField source="dependencia" />
        </SingleFieldList>
      </ArrayField>

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Otros
      </Typography>
      <TextField source="observaciones" label="Observaciones" />
      <TextField source="otros" label="Otros" />

      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        Información del Reporte
      </Typography>
      <TextField source="usuario_reportando" label="Usuario" />
      <DateField source="createdAt" label="Creado" showTime />
    </SimpleShowLayout>
  </Show>
);
