import { AccessProvider } from "react-admin";

export const accessProvider: AccessProvider = {
  canAccess: async (obj) => {
    console.log(obj, "FROM ACCESS");
    return { canAccess: true };
  },
};

// canAccess({
// resource: "users",
// action: "field.read",
// field: "salary"
// })
//
// Got it 👍 You want a **step-by-step, practical guide**:
//
// 1. **Resource visibility** (show/hide whole resource)
// 2. **Action visibility** (edit/create/delete buttons, etc.)
// 3. **Field-level visibility** (hide/disable individual fields)
//
// I’ll show **where** each control should go and a **code example**.
//
// ---
//
// # 1️⃣ Resource Visibility
//
// 👉 **Place control at `<Resource>` declaration** using the `accessControlProvider`.
//
//   React-Admin will call:
//
//   ```ts
// canAccess({ resource: "users", action: "resource" })
// ```
//
// If `false`, the **resource won’t show in the sidebar/menu**.
//
// ```tsx
// // Admin.tsx
// import { Admin, Resource } from "react-admin";
//
// const App = () => (
//   <Admin
//     dataProvider={dataProvider}
//     authProvider={authProvider}
//     accessControlProvider={accessControlProvider}
//   >
//     <Resource name="users" list={UserList} edit={UserEdit} />
//     <Resource name="orders" list={OrderList} /> {/* maybe hidden if not allowed */}
//   </Admin>
// );
// ```
//
// 👉 Example rule in your `accessControlProvider`:
//
// ```ts
// const accessControlProvider = {
//   canAccess: async ({ resource, action }) => {
//     const role = localStorage.getItem("role");
//
//     if (action === "resource" && resource === "orders" && role !== "admin") {
//       return { canAccess: false };
//     }
//
//     return { canAccess: true };
//   },
// };
// ```
//
// ---
//
// # 2️⃣ Action Visibility (Edit, Create, Delete, etc.)
//
// 👉 **Place control at button or view level** using `useCanAccess` or `<WithAccessControl>`.
//
//   React-Admin will call:
//
//   ```ts
// canAccess({ resource: "users", action: "edit", record })
// ```
//
// ### Example: hide **EditButton** if not allowed
//
//   ```tsx
// import { List, Datagrid, TextField, EditButton, useCanAccess } from "react-admin";
//
// export const UserList = () => (
//   <List>
//     <Datagrid>
//       <TextField source="id" />
//       <TextField source="name" />
//
//       <WithAccessControl resource="users" action="edit">
//         <EditButton />
//       </WithAccessControl>
//     </Datagrid>
//   </List>
// );
// ```
//
// 👉 Rule in `accessControlProvider`:
//
// ```ts
// if (resource === "users" && action === "edit" && role !== "manager") {
//   return { canAccess: false };
// }
// ```
//
// ---
//
// # 3️⃣ Field-Level Visibility
//
// 👉 **Place control at field component level** with `<WithAccessControl>` or `useCanAccess`.
//
//   React-Admin will call:
//
//   ```ts
// canAccess({ resource: "users", action: "field.read", field: "salary" })
// ```
//
// ### Example: hide **salary field**
//
// ```tsx
// import { Edit, SimpleForm, TextInput } from "react-admin";
// import { WithAccessControl } from "react-admin";
//
// export const UserEdit = () => (
//   <Edit>
//     <SimpleForm>
//       <TextInput source="name" />
//
//       <WithAccessControl resource="users" action="field.read" field="salary">
//         <TextInput source="salary" />
//       </WithAccessControl>
//     </SimpleForm>
//   </Edit>
// );
// ```
//
// 👉 Rule in `accessControlProvider`:
//
// ```ts
// if (resource === "users" && field === "salary" && role !== "admin") {
//   return { canAccess: false };
// }
// ```
//
// ---
//
// # 📌 Summary (Where to Place Controls)
//
// | Level        | Where to Place It                           | Example Tool                            |
// | ------------ | ------------------------------------------- | --------------------------------------- |
// | **Resource** | In `<Admin><Resource … /></Admin>`          | `canAccess({ action: "resource" })`     |
// | **Action**   | On buttons/views (EditButton, CreateButton) | `<WithAccessControl>` or `useCanAccess` |
// | **Field**    | Around fields in forms or details           | `<WithAccessControl>` or `useCanAccess` |
//
// ---
//
// ✅ This way, your **accessControlProvider** becomes the **single source of truth** for **resource visibility**, **action availability**, and **field-level control**.
//
// ---
//
//   Do you want me to now show you a **single unified `accessControlProvider`** that covers all three cases (resource, action, field) so you don’t have to repeat logic in multiple places?
