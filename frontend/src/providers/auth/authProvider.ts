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
    };
    
    console.log('User data:', user);
    
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
    return Promise.resolve(undefined);
  },
  
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
