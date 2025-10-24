# Setup del Proyecto

## Instalación Automática

El proyecto incluye un script de instalación automática que configura todo por ti.

### Paso 1: Ejecutar deploy.sh

```bash
chmod +x deploy.sh
./deploy.sh
```

### Paso 2: Seleccionar Frontend o Backend

El script te preguntará:

```
Front or backend? (f/b)
```

**Opciones:**
- Escribe `f` para instalar el **Frontend**
- Escribe `b` para instalar el **Backend**

## ¿Qué hace cada opción?

### Opción `f` - Frontend

El script automáticamente:

1. Instala Node.js y Bun
2. Genera certificados SSL para HTTPS
3. Clona el repositorio
4. Copia `.env.example` a `.env`
5. Instala dependencias con `bun install`
6. Construye el proyecto con `bun run build`
7. Inicia el servidor con `bun run serve`

**Ubicación:** `alcaldiacuajimalpa/frontend/`

### Opción `b` - Backend

El script automáticamente:

1. Instala Node.js y Bun
2. Instala y configura MongoDB
3. Inicia MongoDB como servicio
4. Genera certificados SSL para HTTPS
5. Clona el repositorio
6. Copia `.env.example` a `.env`
7. Instala dependencias con `bun install`
8. Inicia el servidor con `bun run start`

**Ubicación:** `alcaldiacuajimalpa/backend/`

## Configurar variables de entorno

Después de ejecutar el script, edita el archivo `.env`:

### Backend: `backend/.env`

```bash
nano backend/.env
```

**Variables importantes:**

```env
# Conexión a MongoDB
CONNECTIONSTRING='mongodb://127.0.0.1/paramedia/'
DB=paramedia

# Seguridad (CAMBIAR ESTOS VALORES)
SECRET_KEY="TuClaveSecretaSuperSegura"
SALT="TuSaltAleatoria"

# Puerto del servidor
PORT=3000

# HTTPS (opcional)
USE_HTTPS=true
SSL_KEY_PATH=./certs/selfsigned.key
SSL_CERT_PATH=./certs/selfsigned.crt
```

**⚠️ IMPORTANTE:** Cambia `SECRET_KEY` y `SALT` por valores únicos y seguros en producción.

### Frontend: `frontend/.env`

Configura la URL del backend:

```env
VITE_API_URL=http://localhost:3000
# o para HTTPS:
VITE_API_URL=https://localhost:3000
```

## Instalación Manual (alternativa)

Si prefieres instalar manualmente:

### Backend

```bash
cd backend
cp .env.example .env
nano .env  # Editar variables
bun install
bun run start
```

### Frontend

```bash
cd frontend
cp .env.example .env
nano .env  # Editar variables
bun install
bun run dev
```

## Usuario por defecto

Una vez iniciado el backend, se crea automáticamente un usuario admin:

**Email:** `admin@paramedia.com`
**Contraseña:** `123`

**⚠️ CAMBIAR** esta contraseña después del primer login.

## Puertos por defecto

- **Backend:** `http://localhost:3000` o `https://localhost:3000`
- **Frontend:** Verifica la consola al iniciar (usualmente `5173` o `3001`)

## Verificar instalación

### Backend

Prueba el endpoint de login:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@paramedia.com","password":"123"}'
```

Deberías recibir un token.

### Frontend

Abre el navegador en la URL mostrada en consola y verifica que cargue la aplicación.
