# Personas Microservice (Microservice A)

Implements CRUD for Students, Teachers, Classes and their relationships plus membership management and an incremental admin sync endpoint. Built with Node.js, TypeScript, Express and Sequelize (SQL Server) following Clean Architecture + Vertical Slice principles (domain-centric, use-case oriented). OpenAPI spec lives in `docs/personasSwagger.yaml` and is served by the application.

## Stack
- Node.js 20+
- TypeScript (CommonJS output)
- Express
- Sequelize + Tedious (SQL Server); planned sqlite in-memory fallback for local rapid dev (`DB_DIALECT=sqlite`)
- Zod for validation schemas
- Pino for structured logging
- Swagger UI (serving `docs/personasSwagger.yaml`)

## Folder Structure
```
src/
  application/        # Use-cases per slice
    use-cases/
      students/
      teachers/
      classes/
  domain/             # Entities & repository interfaces
    entities/
    repositories/
  infrastructure/
    config/           # sequelize init
    database/
      models/         # Sequelize models
      migrations/     # (placeholder, future migrations)
    repositories/     # Sequelize repo implementations
  interface/
    controllers/      # Express controllers per slice
    routes/           # Route files per slice
    middlewares/      # Error, auth mock, etc.
  shared/
    errors/           # ApiError abstraction
    logger/           # Pino logger
    utils/            # Internal event emitter placeholder
  index.ts            # App bootstrap
```

## Environment Variables (`.env`)
```
DB_HOST=localhost
DB_PORT=1433
DB_NAME=personas_db
DB_USER=sa
DB_PASSWORD=YourStrong!Passw0rd
PORT=3000
LOG_LEVEL=info
JWT_PUBLIC_KEY=replace-with-public-key-or-secret
```

## Install & Run
```bash
npm install
npm run dev
```
Service listens on `http://localhost:3000`.

Build (type checking + emit to `dist/`):
```bash
npm run build
```

Run production build:
```bash
npm start
```

## Health Check
`GET /health` -> `{ status: "ok" }`
`GET /health/db` -> attempts a simple DB connectivity check.

## Response Format
Consistent envelope:
Success: `{ data, meta, message }`
Error: `{ data: null, meta: null, message: "Error", error: { code, message, details? } }`

`meta` may contain pagination (`page`, `size`, `total`) when listing.

## Students Endpoints
- `GET /students?page=1&size=50&q=search`
- `POST /students` body: `{ "cpf":"12345678901", "full_name":"John Doe" }`
- `GET /students/:studentId`
- `PUT /students/:studentId` body: `{ "full_name":"New Name" }`
- `DELETE /students/:studentId`
- `PUT /students/:studentId/device` body: `{ "device_id":"ios-device-123" }` (associates or updates the device for the student; first-time binding scenario)

## Teachers Endpoints
- `GET /teachers?page=1&size=50`
- `POST /teachers` body: `{ "cpf":"12345678901", "full_name":"Jane Doe", "email":"jane@example.com" }`
  - Emits internal event `teacher.password.setup` if password_hash omitted (placeholder publisher).
- `GET /teachers/:teacherId`
- `PUT /teachers/:teacherId`
- `DELETE /teachers/:teacherId`

## Classes Endpoints
- `GET /classes?page=1&size=50`
- `POST /classes` body: `{ "name":"Class A" }`
- `GET /classes/:classId` (returns hydrated `students` and `teachers` arrays)
- `PUT /classes/:classId`
- `DELETE /classes/:classId`

### Class Membership
Students:
- `GET /classes/:classId/students`
- `POST /classes/:classId/students` body: `{ "student_id": 1 }`
- `DELETE /classes/:classId/students/:studentId`

Teachers:
- `GET /classes/:classId/teachers`
- `POST /classes/:classId/teachers` body: `{ "teacher_id": 2 }`
- `DELETE /classes/:classId/teachers/:teacherId`

All membership add/remove operations validate existence first and return 404 if entity or current membership state is invalid.

`GET /classes/:classId` returns fully hydrated membership arrays (`students[]`, `teachers[]`).

## Admin Sync Endpoint
`POST /admin/sync`
Processes batch actions for students, teachers, and classes in a single request.
Payload example:
```json
{
  "students": [
    { "action": "create", "record": { "cpf": "123", "full_name": "Ana" } },
    { "action": "update", "record": { "id": 2, "full_name": "Updated" } }
  ],
  "teachers": [
    { "action": "delete", "record": { "id": 5 } }
  ],
  "classes": [
    { "action": "create", "record": { "name": "Algebra" } }
  ]
}
```
Returns summary counts per entity & action.

## Internal Events
Currently logged via Pino (`shared/utils/internalEvents.ts`). Replace with Service Bus/Kafka publisher later.

## OpenAPI / Swagger
Spec file at `docs/personasSwagger.yaml`.
Served at `/openapi` (raw YAML/JSON depending on loader) and interactive Swagger UI at `/docs`.

## Docker
Build and run:
```bash
docker build -t personas-service .
docker run --env-file .env -p 3000:3000 personas-service
```

## Next Steps / TODO
- Implement sqlite in-memory fallback for local dev (`DB_DIALECT=sqlite`).
- Add pagination metadata enhancements (links, total pages).
- Add unit & integration tests (use supertest + jest).
- Integrate real JWT verification using gateway public key.
- Align OpenAPI spec with response envelope for every path.
- Implement event bus publisher (Service Bus / Kafka).
- Add CI workflow (lint, test, build).
- Performance: Avoid N+1 fetch when hydrating class memberships (batch load).
