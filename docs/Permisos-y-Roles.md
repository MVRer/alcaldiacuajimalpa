# Permisos y Roles

## ¿Cómo funcionan los permisos?

Cada usuario tiene un campo `permissions` que es un array de permisos. Cuando intentas hacer una acción en la API, el sistema verifica que tengas el permiso necesario.

### Ejemplo de usuario con permisos

```json
{
  "nombre": "Juan",
  "role": "paramedic",
  "permissions": ["view_reports", "create_reports", "view_my_reports"]
}
```

Este usuario **puede**:
- Ver todos los reportes
- Crear nuevos reportes
- Ver sus propios reportes

Este usuario **NO puede**:
- Editar reportes
- Eliminar reportes
- Gestionar usuarios

## Permiso especial: Administrador

Si un usuario tiene el permiso `"*"`, tiene **todos los permisos**.

```json
{
  "nombre": "Admin",
  "role": "admin",
  "permissions": ["*"]
}
```

## Lista de permisos disponibles

### Permisos de Reportes
- `view_reports` - Ver todos los reportes
- `create_reports` - Crear reportes nuevos
- `edit_reports` - Editar reportes existentes
- `delete_reports` - Eliminar reportes
- `view_my_reports` - Ver solo mis reportes
- `view_turn_reports` - Ver reportes de mi turno

### Permisos de Usuarios
- `view_users` - Ver todos los usuarios
- `create_users` - Crear usuarios nuevos
- `edit_users` - Editar usuarios existentes
- `delete_users` - Eliminar usuarios
- `view_turn_users` - Ver usuarios de mi turno

## Roles del sistema

### `admin` - Administrador
Usuario con acceso completo al sistema.

**Permisos típicos:** `["*"]`

**Puede hacer:** Todo

### `turnchief` - Jefe de Turno
Supervisa y coordina el trabajo del personal en su turno.

**Permisos típicos:**
```json
["view_reports", "create_reports", "edit_reports", "view_turn_reports", "view_turn_users"]
```

**Puede hacer:**
- Ver, crear y editar reportes
- Ver reportes y usuarios de su turno

### `paramedic` - Paramédico
Personal que atiende emergencias en campo.

**Permisos típicos:**
```json
["view_reports", "create_reports", "view_my_reports"]
```

**Puede hacer:**
- Ver reportes
- Crear sus propios reportes
- Ver solo sus reportes personales

### `dispatcher` - Despachador
Personal que recibe y coordina llamadas de emergencia.

**Permisos típicos:**
```json
["view_reports", "create_reports", "edit_reports"]
```

**Puede hacer:**
- Ver y crear reportes
- Editar reportes para actualizar información

### `coordinator` - Coordinador
Coordina operaciones y recursos.

**Permisos típicos:**
```json
["view_reports", "view_users", "view_turn_reports", "view_turn_users"]
```

**Puede hacer:**
- Ver reportes y usuarios
- Ver información de turnos

## ¿Cómo asignar permisos?

Al crear o editar un usuario, incluye el array de permisos:

```javascript
const usuario = {
  nombre: "María",
  role: "paramedic",
  permissions: [
    "view_reports",
    "create_reports",
    "view_my_reports"
  ]
};
```

## Usuario por defecto

El sistema crea automáticamente un usuario administrador:

**Email:** `admin@paramedia.com`
**Contraseña:** `123`
**Permisos:** `["*"]`
