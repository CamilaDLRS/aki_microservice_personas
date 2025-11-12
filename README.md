# AKI! Microservice A - Personas

Gerenciamento de Pessoas (Students, Teachers, Classes) e relações (matrículas, dispositivos) com fluxo de login e sincronização administrativa em lote.

## 👥 Autores
- Camila Delarosa  
- Dimitri Prudente Delinski  
- Guilherme Belo  
- Yasmin Carmona

---
## 🎯 Objetivo do Microserviço
Fornecer lógica de negócio para:
- CRUD de alunos (students) com vínculo de dispositivo
- CRUD de professores (teachers) com fluxo de criação de senha / recuperação
- CRUD de turmas (classes) e gestão de membros (alunos & professores)
- Endpoint de sincronização administrativa em lote (`/admin/sync`)
- Autenticação básica (login) e emissão de eventos internos para criação/recuperação de senha

Integra-se a outros serviços (ex.: Core, Gateway) através do API Gateway.

---
## 🏛️ Arquitetura
Princípios adotados:
- Clean Architecture
- SOLID
- Vertical Slice Architecture

### Por que Vertical Slice?
Cada feature (slice) contém todo o fluxo de um caso de uso: rota, controlador, validação, aplicação, domínio e persistência. Benefícios:
- Evolução isolada por funcionalidade
- Menor acoplamento entre módulos
- Testes focados por caso de uso
- Facilidade para remover/substituir uma feature

### Regras de Arquitetura (Testadas em `architecture-tests`)
1. Slices não importam diretamente umas às outras (students, teachers, classes, admin).
2. Domínio não depende de infraestrutura.
3. Domínio não depende de interface (controllers/middlewares).
4. Domínio não conhece a implementação de persistência (Sequelize models).
5. Ausência de ciclos na pasta `features`.

### Camadas / Pastas
- `src/features/` : Slices verticais (students, teachers, classes, admin) agrupando casos de uso (`createX`, `listX`, etc.).
- `src/shared/Infrastructure/` : Configuração técnica (Sequelize, models, repos implementations).
- `src/shared/domain/` : Entidades/Value Objects/Interfaces de repositório (quando presentes).
- `src/interface/` : (não presente aqui de forma isolada) — controllers e rotas estão dentro das slices (`*Routes.ts`).
- `src/shared/` : Logger, utils (eventos internos, email), errors.
- `architecture-tests/` : Especificações de regras estruturais (TSArch).

### Fluxo Típico (Ex.: Criar Student)
1. Request chega à rota em `studentRoutes.ts`.
2. Caso de uso `createStudent` dispara validação (Zod / shape do input).
3. Handler (use-case) instancia entidade / prepara dados.
4. Repositório (Sequelize) persiste via model correspondente (`StudentModel`).
5. Retorno padronizado entregue ao cliente.

### Domínio vs Persistência
- Domínio: entidades e invariantes (ex.: CPF, email). 
- Persistência: models Sequelize em `shared/Infrastructure/database/models`.
- Dependência sempre invertida (domínio não importa models). Interfaces de repositório definem contrato.

---
## 📂 Estrutura Resumida
```
src/
  index.ts
  features/
    students/ (create, list, getById, getByCpf, getByDevice, update, delete, updateDevice)
    teachers/ (create, list, getById, login, recoverPassword, update, delete)
    classes/  (create, list, getById, update, delete, add/remove student, add/remove teacher)
    admin/    (adminRoutes sync)
  shared/
    Infrastructure/
      config/sequelize.ts
      database/models/ (StudentModel, TeacherModel, ClassModel, ClassStudentModel, ClassTeacherModel)
      repositories/ (implementações Sequelize)
    logger/
    errors/
    utils/ (event emitter, sendPasswordEmail)
    domain/ (se existirem VO/entidades puras)
  types/
  architecture-tests/ (regras de arquitetura)
```

---
## 🔐 Autenticação
Fluxo de login básico (`/teachers/login` ou similar via `login/` slice) retornando JWT assinado (ver futuramente validação via chave pública no Gateway). Recuperação de senha e setup acionam evento interno (`sendPasswordEmail` usando `AZURE_FUNCTION_URL`).

---
## 🌍 Variáveis de Ambiente (Essenciais)
| Variável | Descrição |
|----------|-----------|
| `DB_HOST`, `DB_PORT` | Host/porta do banco (SQL Server default) |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Credenciais do banco |
| `DB_DIALECT` | Dialeto (`mssql` ou `sqlite` para dev rápido) |
| `DB_ENCRYPT` | Ativa criptografia TLS (default true) |
| `DB_TRUST_CERT` | Confiar certificado não assinado (dev) |
| `DB_LOG_SQL` | Logar SQL no console |
| `DB_POOL_MIN`, `DB_POOL_MAX` | Pool de conexão min/max |
| `LOG_LEVEL` | Nível de log Pino |
| `PORT` | Porta HTTP do serviço |
| `JWT_PUBLIC_KEY` | Chave pública (validação de tokens futura) |
| `AZURE_FUNCTION_URL` | URL da função de envio de email de senha |
| `NODE_ENV` | Ambiente (`development` / `production`) |

---
## 🧪 Testes
- Unitários / integração (planejados) usando Jest + Supertest.
- Testes de arquitetura: `architecture-tests/` garantindo invariantes estruturais.

Rodar (quando disponível):
```bash
npm test
```

---
## 🔄 Endpoints Principais (Resumo)
### Students
- `GET /students` (paginação `page`, `size`, busca `q`)
- `POST /students`
- `GET /students/:studentId`
- `PUT /students/:studentId`
- `DELETE /students/:studentId`
- `PUT /students/:studentId/device` (associa/atualiza `device_id`)
- `GET /students/device/:deviceId` (quando implementado)
- `GET /students/cpf/:cpf`

### Teachers
- `GET /teachers`
- `POST /teachers` (dispara evento interno se sem senha)
- `GET /teachers/:teacherId`
- `PUT /teachers/:teacherId`
- `DELETE /teachers/:teacherId`
- `POST /teachers/login` (autenticação)
- `POST /teachers/recover-password` (fluxo recuperação)

### Classes & Membership
- CRUD: `GET /classes`, `POST /classes`, `GET/PUT/DELETE /classes/:classId`
- Membros (students): `GET /classes/:classId/students`, `POST ...`, `DELETE ...`
- Membros (teachers): `GET /classes/:classId/teachers`, `POST ...`, `DELETE ...`

### Admin Sync
- `POST /admin/sync` processamento em lote (students, teachers, classes) com ações `create`, `update`, `delete`.

### Health
- `GET /health` status básico.

Envelope de resposta segue o padrão: sucesso `{ data, meta, message }` / erro `{ data:null, meta:null, message, error:{ code, message, details? } }`.

---
## 🚀 Execução
### Desenvolvimento
```bash
npm install
npm run dev
# http://localhost:3000
```
### Build
```bash
npm run build
```
### Produção
```bash
npm start
```

---
## 🐳 Docker
```bash
docker build -t personas-service .
docker run --env-file .env -p 3000:3000 personas-service
```

---
## 📏 Convenções
- Cada caso de uso: pasta dedicada (`createX`, `listX`, etc.).
- Repositórios: contrato no domínio / implementação em Infrastructure.
- Value Objects centralizam invariantes (CPF, email). 
- Erros centralizados em `shared/errors`.
- Eventos internos futuramente migrados para bus (Service Bus / Kafka).

---
## 🔭 Próximos Passos
- Fallback SQLite para dev rápido (`DB_DIALECT=sqlite`).
- Testes unitários + integração (Jest/Supertest).
- JWT verificado com chave pública do Gateway.
- Publisher de eventos assíncronos (Service Bus / Kafka).
- Melhorar paginação (`meta` com totalPages, links).
- Evitar N+1 em hidratação de memberships (batch load / eager config).
- CI (lint, test, build, scan).
- Harden de segurança (rate limit, audit log).

---
## Licença
Uso interno acadêmico / estudo.
