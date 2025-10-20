import { AuthProvider, HttpError } from "react-admin";

export const authProvider: AuthProvider = {

  login: async ({ username, password }) => {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const data = await response.json();

    const user = {
      id: data.user._id,
      fullname: data.user.nombre + " " + data.user.apellidos,
      username: data.user.correo_electronico,
      turnos: data.user.turnos || [],
      role: data.user.role,
    };

    const auth = data.token;
    const permissions = data.user.permissions;

    // Guardar en localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("auth", "Bearer " + auth);
    localStorage.setItem("permissions", JSON.stringify(permissions));
    
    return Promise.resolve();
    
  } catch (error) {
    console.error('Error:', error);
    return Promise.reject(
      new HttpError("Unauthorized", 401, {
        message: "Invalid username or password",
      })
    );
  }
},

  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    localStorage.removeItem("permissions");
    return Promise.resolve();
  },

  checkError: () => Promise.resolve(),

  checkAuth: () =>
    localStorage.getItem("user") ? Promise.resolve() : Promise.reject(),


  getPermissions: () => {
    const permissions = localStorage.getItem("permissions");
    return Promise.resolve(permissions ? JSON.parse(permissions) : []);
  },
  
  getIdentity: () => {
    const persistedUser = localStorage.getItem("user");
    const user = persistedUser ? JSON.parse(persistedUser) : null;

    if (!user) {
      return Promise.reject();
    }

    return Promise.resolve({
      id: user.id,
      fullName: user.fullname,
      avatar: undefined,
      turnos: user.turnos,
      role: user.role,
    });
  },
};

export default authProvider;
