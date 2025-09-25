import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkAuth: () => Promise.resolve(),
  checkError: () => Promise.resolve(),
  // getPermissions: () => Promise.resolve(["demo"]),
  getIdentity: () =>
    Promise.resolve({ id: 1, fullName: "Demo User", avatar: undefined }),
  canAccess: async ({ resource, action, record, signal }) => {
    console.log({ resource, action, record, signal });
    return { canAccess: true };
  },
};
