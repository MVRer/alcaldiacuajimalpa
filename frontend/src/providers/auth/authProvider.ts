import { AuthProvider, HttpError } from "react-admin";
// import data from "./users.json";

/**
 * This authProvider is only for test purposes. Don't use it in production.
 */
export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    let user = null;

    // Mocked login
    if (username === "1" && password === "1") {
      user = {
        id: 1,
        userName: "1",
        name: "Jose",
        fullName: "Joseeeee",
        turn: 3,
        role: "admin", // TODO: add authorization schema
      };
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      return Promise.resolve();
    }

    return Promise.reject(
      new HttpError("Unauthorized", 401, {
        message: "Invalid username or password",
      }),
    );
  },

  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve();
  },

  checkError: () => Promise.resolve(),

  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),

  getPermissions: () => Promise.resolve(),

  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    if (!user) {
      return Promise.reject();
    }

    return Promise.resolve({
      id: user.id,
      userName: user.userName,
      name: user.name,
      fullName: user.fullName,
      avatar: undefined, // TODO: optional, can be a URL look up later
      turn: user.turn,
      role: user.role,
    });
  },
};

export default authProvider;
