# API de Autenticación

## Iniciar Sesión

**Endpoint:** `POST /login`

Permite a un usuario entrar al sistema con su correo y contraseña.

**¿Necesita token?** No

### Request HTTP

```http
POST /login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "username": "admin@paramedia.com",
  "password": "123"
}
```

### Response HTTP

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Admin",
    "apellidos": "Sistema",
    "correo_electronico": "admin@paramedia.com",
    "role": "admin",
    "permissions": ["*"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Ejemplo JavaScript

```javascript
async function login() {
  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin@paramedia.com',
      password: '123'
    })
  });

  const data = await response.json();

  // Guardar token para usarlo después
  localStorage.setItem('token', data.token);

  return data;
}

// Usar
login().then(data => {
  console.log('Usuario:', data.user.nombre);
  console.log('Token guardado');
});
```

## Usar el Token

Para todas las demás peticiones, incluye el token:

### Request HTTP

```http
GET /users HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ejemplo JavaScript

```javascript
async function hacerPeticionAutenticada() {
  const token = localStorage.getItem('token');

  const response = await fetch('http://localhost:3000/users', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
}
```

**Nota:** El token dura 3 días.
