# Ask Academy Backend

Backend API para Ask Academy construida con Node.js, Express, TypeScript, Prisma y PostgreSQL.

## Overview

La API ya permite:

- Registro y login con JWT.
- Crear categorias propias por usuario.
- Crear quizzes asociados a categorias propias.
- Marcar categorias y quizzes como publicos o privados.
- Consultar solo tus recursos y los publicos.
- Verificar la conexion a la base de datos.

## Tech Stack

- Node.js 22
- TypeScript
- Express 5
- Prisma ORM
- PostgreSQL 15
- Docker Compose
- bcryptjs para hash de contrasenas
- jsonwebtoken para autenticacion

## Arquitectura

- API REST modular.
- Controladores separados por dominio.
- Rutas protegidas con middleware JWT.
- Prisma como capa de acceso a datos.
- PostgreSQL ejecutandose en Docker.

## Estructura del Proyecto

```text
.
|- src
|  |- config
|  |  \- db.ts
|  |- controllers
|  |  |- auth.controller.ts
|  |  |- category.controller.ts
|  |  \- quiz.controller.ts
|  |- middleware
|  |  \- auth.middleware.ts
|  |- routes
|  |  |- auth.routes.ts
|  |  |- category.routes.ts
|  |  \- quiz.routes.ts
|  \- index.ts
|- prisma
|  |- schema.prisma
|  \- migrations
|- generated
|  \- prisma
|- postman
|  \- ask-academy-backend.postman_collection.json
|- docker-compose.yml
|- package.json
\- tsconfig.json
```

## Requisitos

- Node.js 22 o superior
- npm
- Docker y Docker Compose

## Variables de Entorno

Crea un archivo `.env` en la raiz del proyecto con:

```env
PORT=3000
DATABASE_URL=postgresql://admin:mypassword@localhost:5432/dev_db
JWT_SECRET=tu_clave_super_secreta
```

## Instalacion

```bash
npm install
```

## Base de Datos

Levanta PostgreSQL con Docker:

```bash
docker compose up -d postgres
```

Si ya agregaste cambios al schema, aplica la migracion manualmente o con Prisma segun tu flujo.

Luego regenera el cliente:

```bash
npx prisma generate
```

## Ejecucion

```bash
npm run dev
```

## Endpoints

### Health

- `GET /`
  - Respuesta basica de prueba.

- `GET /health/db`
  - Verifica conectividad con PostgreSQL.

### Auth

- `POST /api/auth/register`
  - Crea un usuario.

Body:

```json
{
  "email": "user@mail.com",
  "password": "123456"
}
```

- `POST /api/auth/login`
  - Autentica al usuario y retorna un token JWT.

Body:

```json
{
  "email": "user@mail.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@mail.com"
  }
}
```

### Categories

Todas las rutas requieren `Authorization: Bearer <token>`.

- `POST /api/categories`
  - Crea una categoria propia.

Body:

```json
{
  "name": "Matematicas",
  "isPublic": false
}
```

- `GET /api/categories`
  - Lista tus categorias y las publicas.

- `PATCH /api/categories/:id/visibility`
  - Cambia la visibilidad de una categoria.

Body:

```json
{
  "isPublic": true
}
```

### Quizzes

Todas las rutas requieren `Authorization: Bearer <token>`.

- `POST /api/quizzes`
  - Crea un quiz asociado a una categoria propia.

Body:

```json
{
  "title": "Quiz de Matematicas",
  "description": "Nivel basico",
  "categoryId": "uuid-de-categoria",
  "isPublic": false
}
```

- `GET /api/quizzes`
  - Lista tus quizzes y los publicos.

- `PATCH /api/quizzes/:id/visibility`
  - Cambia la visibilidad de un quiz.

Body:

```json
{
  "isPublic": true
}
```

## Coleccion de Postman

Importa la coleccion ubicada en:

- [postman/ask-academy-backend.postman_collection.json](postman/ask-academy-backend.postman_collection.json)

Variables incluidas:

- `baseUrl`
- `token`
- `categoryId`
- `quizId`

## Flujo de Prueba Recomendado

1. Levanta PostgreSQL y el backend.
2. Haz `register`.
3. Haz `login` y copia el token.
4. Crea una categoria.
5. Crea un quiz usando esa categoria.
6. Prueba `GET /api/categories` y `GET /api/quizzes`.
7. Cambia la visibilidad de ambos a publico.
8. Verifica con otro usuario que solo vea lo publico.

## Scripts

- `npm run dev`
  - Ejecuta el servidor con recarga automatica.

## Estado Actual

Funcionalidades ya implementadas:

- Auth con registro y login.
- Middleware JWT.
- Categorias por usuario.
- Quizzes por usuario.
- Visibilidad publica y privada.
- Coleccion de Postman para pruebas.

Siguientes pasos sugeridos:

- CRUD completo de categorias.
- CRUD completo de quizzes.
- Validacion de payloads con Zod.
- Documentacion OpenAPI o Swagger.
- Tests unitarios e integracion.

## Seguridad

- Las contrasenas se guardan con bcrypt.
- No subas `.env` al repositorio.
- Usa un `JWT_SECRET` fuerte por entorno.

## Licencia

ISC
