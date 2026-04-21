# Ask Academy Backend

Backend API para la plataforma Ask Academy, construido con Node.js, Express, TypeScript, Prisma y PostgreSQL.

## Objetivo

Este proyecto expone endpoints para:
- Autenticacion de usuarios (registro y login con JWT)
- Gestion de quizzes
- Verificacion de salud del servicio y conexion a base de datos

## Stack Tecnologico

- Node.js 22
- TypeScript
- Express 5
- Prisma ORM
- PostgreSQL 15
- Docker Compose
- bcryptjs (hash de contrasenas)
- jsonwebtoken (autenticacion)

## Arquitectura Actual

- API REST con Express
- Prisma como capa de acceso a datos
- PostgreSQL corriendo en Docker
- Estructura modular por rutas y controladores

## Estructura del Proyecto

```
.
|- src
|  |- config
|  |  \- db.ts
|  |- controllers
|  |  |- auth.controller.ts
|  |  \- quiz.controller.ts
|  |- routes
|  |  |- auth.routes.ts
|  |  \- quiz.routes.ts
|  \- index.ts
|- prisma
|  |- schema.prisma
|  \- migrations
|- generated
|  \- prisma
|- docker-compose.yml
|- package.json
\- tsconfig.json
```

## Requisitos Previos

- Node.js >= 22
- npm
- Docker y Docker Compose

## Configuracion del Entorno

Crea un archivo `.env` en la raiz del proyecto con:

```env
PORT=3000
DATABASE_URL=postgresql://admin:mypassword@localhost:5432/dev_db
JWT_SECRET=tu_clave_super_secreta
```

## Instalacion y Ejecucion

1. Instalar dependencias:

```bash
npm install
```

2. Levantar PostgreSQL con Docker:

```bash
docker compose up -d postgres
```

3. Ejecutar migraciones y generar cliente Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

4. Iniciar servidor en modo desarrollo:

```bash
npm run dev
```

## Endpoints Disponibles

### Health

- `GET /`
	- Respuesta basica de prueba.

- `GET /health/db`
	- Verifica conectividad con PostgreSQL.

### Auth

- `POST /api/auth/register`
	- Crea un usuario nuevo.

Body esperado:

```json
{
	"email": "user@mail.com",
	"password": "123456"
}
```

- `POST /api/auth/login`
	- Autentica usuario y retorna JWT.

Body esperado:

```json
{
	"email": "user@mail.com",
	"password": "123456"
}
```

Respuesta esperada:

```json
{
	"token": "jwt_token",
	"user": {
		"id": "uuid",
		"email": "user@mail.com"
	}
}
```

### Quizzes

- `POST /api/quizzes`
	- Crea un quiz.

Body esperado:

```json
{
	"title": "Quiz de Matematicas",
	"description": "Nivel basico",
	"userId": "uuid-del-usuario",
	"categoryId": "uuid-de-categoria"
}
```

- `GET /api/quizzes`
	- Lista quizzes con categoria y autor.

## Scripts

- `npm run dev`
	- Ejecuta la API con recarga automatica usando tsx watch.

## Estado del Proyecto

MVP en progreso con:
- Registro y login funcionales
- CRUD parcial de quizzes
- Modelo relacional base en Prisma

Pendiente sugerido:
- Middleware de autorizacion por JWT en rutas protegidas
- Validacion robusta de payloads con Zod o Joi
- Manejo centralizado de errores
- Tests unitarios e integracion
- Documentacion OpenAPI/Swagger

## Seguridad

- Las contrasenas se almacenan con hash mediante bcryptjs.
- Nunca subir archivo `.env` al repositorio.
- Usa un JWT_SECRET fuerte y diferente por entorno.

## Licencia

ISC