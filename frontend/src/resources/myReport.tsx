import { Create, TextInput, TabbedForm, FormTab } from "react-admin";

export const CreateMyReport = () => (
  <Create>
    <TabbedForm>
      <FormTab label="Main">
        <TextInput source="name" label="Nombre" />
        <TextInput source="name" label="Descripcion" multiline={true} />
      </FormTab>

      <FormTab label="Descripcion">
        <TextInput source="name" label="Nombre" />
      </FormTab>
    </TabbedForm>
  </Create>
);

// import {
//   Create,
//   Form,
//   TextInput,
//   SaveButton,
// } from "react-admin";
// import { Grid } from "@mui/material";
//
// export const CreateMyReport = () => (
//   <Create>
//     <Form>
//       <Grid container>
//         <Grid item xs={6}>
//           <TextInput source="title" />
//         </Grid>
//         <Grid item xs={6}>
//           <TextInput source="author" />
//         </Grid>
//         <Grid item xs={12}>
//           <SaveButton />
//         </Grid>
//       </Grid>
//     </Form>
//   </Create>
// );
