# API Stock — Anotaciones del proyecto

## Arquitectura por capas

```
index.js  (punto de entrada)
   ↓
routes/   (define las URLs)
   ↓
controllers/  (reciben la request, validan, responden)
   ↓
services/     (lógica de negocio)
   ↓
models/       (hablan con la base de datos)
   ↓
data/         (configuración de Firebase)
```

**Flujo de una petición:**
Cliente → index.js → ruta matchea → controller → service → model → Firestore → y vuelve para atrás.

---

## Capas explicadas

### index.js — El servidor
- Crea la app con `express()`
- Conecta middlewares con `app.use()`
- Prende el servidor con `app.listen(PORT, callback)`

### Middlewares
Un middleware es una función que se ejecuta en el medio del flujo. Se agregan con `app.use()`.

**app.use()** — método para agregar middlewares a la cinta transportadora. El orden importa.

**app.use(cors())** — permite que navegadores de otros orígenes (frontend) puedan consultar la API. Sin esto, el navegador bloquea la respuesta por seguridad.

**app.use(express.json())** — parsea el body de las peticiones a JSON. Sin esto, `req.body` es `undefined`. En Express 5 viene incluido, no hace falta instalar body-parser aparte.

**Middleware 404** — va al final, después de todas las rutas. Si ninguna ruta matcheó, cae acá:
```javascript
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});
```

**Middleware 500** — captura errores, tiene 4 parámetros (err, req, res, next):
```javascript
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Error interno');
});
```

### app.listen()
Prende el servidor. Sin esto Express está configurado pero no escucha nada.
```javascript
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
```

### Métodos de app
| Método | Qué hace |
|--------|----------|
| `app.use()` | Middleware genérico |
| `app.get()` | Responde a GET |
| `app.post()` | Responde a POST |
| `app.put()` | Responde a PUT |
| `app.delete()` | Responde a DELETE |
| `app.listen()` | Prende el servidor |

---

### .env — Variables de entorno
Archivo de configuración con pares CLAVE=VALOR. No va código, solo datos.
```env
PORT=3000
```

Se lee con `dotenv.config()` que mete todo en `process.env`.

---

### Routes — express.Router()
Router es un mini-Express para agrupar rutas por recurso.
```javascript
import express from 'express';
const router = express.Router();

router.get('/api/products', ...);
router.post('/api/products/create', ...);

export default router;
```

Se conecta en index.js con `app.use(miRouter)`.

---

### CORS explicado
CORS existe porque los navegadores bloquean peticiones a orígenes distintos por seguridad.
- Sin CORS: frontend en localhost:5173 no puede consultar backend en localhost:3000
- `app.use(cors())` agrega headers como `Access-Control-Allow-Origin: *` para permitirlo
- Proxy (como en Vite) es solo para desarrollo, no sirve en producción

---

### REST vs Consigna
En REST bien hecho el método HTTP ya dice la acción (POST = crear), pero la consigna a veces pide `/create` en la URL igual. Mejor seguir la consigna para aprobar.

---

## Headers HTTP

Los headers son metadatos que viajan en la request HTTP. No son el body ni la URL.

Pensalo como un sobre de carta:
- La **URL** es la dirección de destino
- El **body** es la carta adentro
- Los **headers** son los datos del sobre: remitente, formato, etc.

En el middleware de autenticación usamos el header `Authorization`:

```
Authorization: Bearer <token>
```

El servidor saca el token del header y lo verifica. Si no está → `401`, si es inválido → `403`.

---

## Optional Chaining (`?.`)

```javascript
const token = req.headers['authorization']?.split(" ")[1];
```

El `?.` es un safety de JavaScript. Si lo de la izquierda es `undefined` o `null`, no sigue ejecutando lo de la derecha y devuelve `undefined` directamente.

Sin el `?.`, si el cliente no manda el header `Authorization`:

```javascript
req.headers['authorization']  // undefined
undefined.split(" ")  // 💥 EXPLOTA -> Cannot read properties of undefined
```

Con el `?.`, si `req.headers['authorization']` es `undefined`, no intenta el `.split()` y `token` queda como `undefined`. Después el `if (!token)` lo ataja y responde `401`.

---

## Auth JWT — Cómo funciona

1. El cliente manda `POST /auth/login` con `email` y `password`
2. Si son `admin@gmail.com` / `123456`, el servidor genera un **token JWT** con `jsonwebtoken`
3. Ese token se firma con `JWT_SECRET_KEY` (del `.env`) y expira en 1 hora
4. El cliente guarda el token y lo manda en cada request protegido como `Authorization: Bearer <token>`
5. El middleware `authentication.js` verifica el token antes de dejar pasar

**Auth por ruta** (como hicimos):
- `GET /api/products` — público
- `GET /api/products/:id` — público
- `POST /api/products/create` — requiere token
- `PUT /api/products/:id` — requiere token
- `DELETE /api/products/:id` — requiere token

---

## Estado del proyecto (30/06)

### Requerimientos completados
- ✅ Req #2: Dependencias instaladas (express, cors, body-parser, dotenv, firebase, jsonwebtoken)
- ✅ Req #3: Servidor configurado (index.js, cors, express.json(), .env, 404, error handler)
- ✅ Req #4: Rutas de productos creadas (products.routes.js)
- ✅ Req #4: auth.routes.js
- ✅ Req #5: Controladores y servicios
- ✅ Req #6: Firebase y modelos
- ✅ Req #7: JWT implementado (login hardcodeado, auth por ruta en POST/PUT/DELETE)

### Archivos creados
- `api-stock/index.js` — servidor completo
- `api-stock/.env` — PORT=3000 + Firebase creds + JWT_SECRET_KEY
- `api-stock/routes/products.routes.js` — rutas de productos con auth por ruta
- `api-stock/routes/auth.routes.js` — ruta POST /auth/login
- `api-stock/controllers/auth.controller.js` — login hardcodeado
- `api-stock/data/token.js` — generación de JWT
- `api-stock/middleware/authentication.js` — verificación de token
