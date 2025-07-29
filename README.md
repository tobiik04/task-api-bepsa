# Task API

Una API RESTful construida con **NestJS** y **Prisma** para gestionar tareas, con autenticación mediante API Key. Permite crear tareas, filtrarlas y actualizar su estado.

---

## Tecnologías utilizadas

- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Jest](https://jestjs.io/) para testing
- Autenticación mediante API Key

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tobiik04/task-api-bepsa.git
cd task-api
```

### 2. Instalar dependencias

```
npm install
```

### 3. Configurar las variables de entorno en base al archivo .env.template

### 4. Ejecutar migraciones y generar cliente Prisma

```
  npx prisma migrate dev
```

## Ejecución.

```
  npm run start:dev
```

# Endpoints

## Autenticación

Todos los endpoints están protegidos por una API key. Se debe incluir ne los headers.
Ejemplo: Beared mi-api-key

## POST api/tasks

Crea una nueva tarea
**Request body:**

```
{
  "title": "Mi tarea",
  "description": "Descripción opcional",
  "dueDate": "2025-08-01T00:00:00.000Z"
}
```

**Response:**

```
{
  "id": 1,
  "title": "Mi tarea",
  "description": "Descripción opcional",
  "dueDate": "2025-08-01T00:00:00.000Z",
  "status": "PENDING",
  "active": true
}
```

## GET api/tasks

Obtiene el listado de tareas.
Estas presentan los siguientes query params totalmente opcionales:

- `title` (string)
- `description` (string)
- `status`[] (array, valores posibles: `PENDING`, `IN_PROGRESS`, `DONE`, `CANCELLED`)
- `dueDate` (string ISO)
- `page` (number)
- `limit` (number)

**Response**

```
[
  {
    "id": 2,
    "title": "Important",
    "description": "Some important",
    "dueDate": "2025-08-01T00:00:00.000Z",
    "status": "PENDING",
    "active": true
  }
]
```

## PATCH api/tasks/:id

**Body**

```
  {
    "status": "COMPLETED"
  }
```

**Response**

```
{
  "id": 1,
  "title": "A",
  "description": "Descripción opcional",
  "dueDate": "2025-08-01T00:00:00.000Z",
  "status": "DONE",
  "active": true
}
```

# Testing

## Ejecutar los tests con:

```
  npm run test y npm run test:cov para el coverage
```

## Decisiones técnicas

- Se utiliza una API Key en el header `Authorization` como esquema `Bearer` para proteger los endpoints.
- Prisma se encarga de la validación del modelo y del acceso a base de datos.
- El filtrado es dinámico y tolerante a combinaciones de parámetros opcionales.
- Se utiliza `class-validator` y `class-transformer` para validaciones DTO.
- Se implementaron tests unitarios con Jest para asegurar la calidad y robustez de los servicios y guards.
- Validación estricta de variables de entorno con **Joi** para evitar errores en configuración al iniciar la aplicación.
- La base de datos está dockerizada, con configuración de conexión controlada mediante variables de entorno, facilitando despliegue y entornos consistentes.
- Los errores se loguean con el logger interno de NestJS para facilitar el debugging.
