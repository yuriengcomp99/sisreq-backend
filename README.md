# SisReq — Backend API

> API REST em **Node.js + TypeScript** para gestão de **requisições de compras**, **atas de pregão**, **notas de crédito** e **capacidade de empenho** — com notificações em tempo real, filas assíncronas e deploy automatizado na AWS.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ESM-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![AWS](https://img.shields.io/badge/Deploy-ECR%20%2B%20EC2-232F3E?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

---

## O que é

O **SisReq** é o backend de um sistema voltado ao fluxo de **compras públicas / licitações** (pregões, itens de ata, saldos, requisições formais e documentos oficiais). O foco deste repositório é entregar uma API **segura, documentada e preparada para produção**, com processos de background desacoplados e infraestrutura containerizada.

---

## Por que este projeto chama atenção

- **Arquitetura em camadas** — Controllers → Use Cases → Repositories, com **factories** para composição e testabilidade.
- **Micro-serviços leves no Docker** — API HTTP, WebSocket e worker RabbitMQ rodam em **containers separados**, cada um com responsabilidade única.
- **Mensageria com RabbitMQ** — Importação de planilhas dispara eventos; workers criam notificações sem bloquear a API.
- **Tempo real via WebSocket** — Contagem de notificações não lidas enviada ao cliente após eventos na fila.
- **Autenticação JWT** — Access token (Bearer) + refresh token em **cookie httpOnly**.
- **Documentação OpenAPI** — Swagger UI em `/docs`.
- **Geração de documentos** — Exportação de requisições em **DOCX** e **PDF** (`docx`, `pdf-lib`).
- **Importação Excel em lote** — Leitura com `xlsx`, processamento em chunks e publicação na fila.
- **CI/CD na AWS** — GitHub Actions faz build, push para **ECR** e deploy na **EC2** com `docker compose`.

---

## Arquitetura

```mermaid
flowchart LR
  subgraph clients [Clientes]
    FE[Frontend]
  end

  subgraph docker [Docker Compose]
    API[api :8080<br/>REST + Swagger]
    WS[ws :8081<br/>WebSocket]
    WRK[worker<br/>RabbitMQ consumer]
    PG[(PostgreSQL)]
    RMQ[(RabbitMQ)]
  end

  FE -->|HTTP REST| API
  FE -->|WS + JWT| WS
  API --> PG
  WS --> PG
  WRK --> PG
  API -->|publish import.finished| RMQ
  RMQ --> WRK
  RMQ --> WS
  WRK -->|notificações| PG
```

| Serviço   | Porta (padrão) | Responsabilidade                                      |
|-----------|----------------|-------------------------------------------------------|
| `api`     | 8080           | REST, auth, regras de negócio, Swagger, migrations    |
| `ws`      | 8081           | Gateway WebSocket + consumer de notificações não lidas |
| `worker`  | —              | Consumer `import.finished` → notificações no banco      |
| `postgres`| 5432           | Persistência (Prisma)                                 |
| `rabbitmq`| 5672 / 15672   | Filas AMQP + painel de management                     |

---

## Principais domínios da API

| Módulo            | Prefixo            | Descrição resumida                                      |
|-------------------|--------------------|---------------------------------------------------------|
| Autenticação      | `/auth`            | Login, refresh, registro, gestão de usuários (roles)    |
| Pregões / Atas    | `/pregoes`         | Consulta de itens, importação Excel de atas             |
| Requisições       | `/requisicoes`     | CRUD, emissão de documentos Word/PDF                    |
| Capacidade        | `/capacidade`      | Itens com saldo disponível para empenho                 |
| Nota de crédito   | `/nota-credito`    | Gestão de notas vinculadas às requisições               |
| Designações       | `/designation`     | Cargos / funções dos usuários                           |
| Notificações      | `/notifications`   | Listagem, leitura e contagem de não lidas                 |
| Dashboard         | `/dashboard`       | Resumo consolidado para o painel                        |

---

## Stack técnica

| Categoria        | Tecnologias                                              |
|------------------|----------------------------------------------------------|
| Runtime          | Node.js 20, TypeScript (ESM), `tsx`                      |
| HTTP             | Express 5, CORS, cookie-parser                           |
| Dados            | PostgreSQL 16, Prisma ORM                                |
| Mensageria       | RabbitMQ (`amqplib`)                                     |
| Tempo real       | `ws` (WebSocket)                                         |
| Segurança        | JWT, bcrypt, middleware de autorização por rota          |
| Arquivos         | Multer (upload), xlsx, docx, pdf-lib                     |
| Docs             | swagger-jsdoc, swagger-ui-express                        |
| Infra            | Docker, Docker Compose, GitHub Actions, AWS ECR/EC2     |

---

## Estrutura do projeto

```
src/
├── controllers/       # Camada HTTP (request/response)
├── use-cases/         # Regras de negócio
├── repositories/      # Acesso a dados (Prisma)
├── factories/         # Injeção de dependências por rota
├── modules/           # Módulos transversais (ex.: notificações)
├── routes/            # Definição de rotas Express
├── middlewares/       # Auth, validações
├── infra/queue/       # RabbitMQ (publishers, filas, conexão)
├── ws-gateway/        # WebSocket + consumers relacionados
├── worker/            # Processos background (CLI)
├── services/          # Geração de documentos, helpers
└── server.ts          # Bootstrap da API HTTP

prisma/                # Schema e migrations
.github/workflows/     # CI/CD (build ECR + deploy EC2)
docker-compose.yml     # Stack local e produção
```

---

## Como rodar

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose
- (Opcional) Node.js 20+ para desenvolvimento sem container

### 1. Variáveis de ambiente

Crie um arquivo `.env` na raiz (usado pelo `docker-compose` e pelos serviços):

```env
# Banco
POSTGRES_USER=sisreq
POSTGRES_PASSWORD=sisreq
POSTGRES_DB=sisreq

# API
API_PORT=8080
NODE_ENV=production

# JWT (obrigatório)
JWT_ACCESS_SECRET=change-me-access
JWT_REFRESH_SECRET=change-me-refresh

# CORS — origens do frontend (vírgula ou espaço)
FRONTEND_ORIGIN=http://localhost:3000

# WebSocket
WS_PORT=8081

# Opcional
SWAGGER_SERVER_URL=http://localhost:8080
```

No Docker, `DATABASE_URL` e `RABBITMQ_URL` são montados automaticamente pelo `docker-compose.yml`.

### 2. Subir o stack completo

```bash
docker compose up --build
```

| Endpoint              | URL                          |
|-----------------------|------------------------------|
| API                   | http://localhost:8080        |
| Swagger UI            | http://localhost:8080/docs   |
| WebSocket             | ws://localhost:8081          |
| RabbitMQ Management   | http://localhost:15672       |

### 3. Desenvolvimento local (sem Docker)

Em terminais separados:

```bash
npm install
npx prisma migrate dev
npm run dev                  # API :8080
npm run dev:ws-service       # WebSocket + consumer unread :8081
npm run worker:notificacoes  # Consumer import.finished
```

---

## Scripts úteis

| Comando                    | Descrição                          |
|----------------------------|------------------------------------|
| `npm run dev`              | API com hot-reload (`tsx watch`)   |
| `npm run dev:ws-service`   | Serviço WebSocket + Rabbit consumer |
| `npm run worker:notificacoes` | Worker de notificações pós-import |
| `npm run build`            | Compilação TypeScript              |
| `npm run start`            | API em produção                    |

---

## CI/CD

Pipeline em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **Build** da imagem Docker e push para **Amazon ECR** (tags `api` e `ws`).
2. **Deploy** via SSH na **EC2**: `docker compose pull` + `up` dos serviços `api`, `ws` e `worker`.

Secrets e variables ficam no GitHub (`AWS_*`, `EC2_*`, `ECR_*`) — nada sensível versionado no repositório.

---

## Modelo de dados (visão geral)

Entidades principais no Prisma: **User**, **Designation**, **AtaItem**, **Requisicao**, **RequisicaoDetalhe**, **NotaCredito**, **Notification** — com enums para papéis (`ADMIN` / `USER`), tipo de empenho e flags sim/não.

---

## Contato

<!-- Substitua pelos seus links -->
- **Autor:** [Seu nome](https://github.com/seu-usuario)
- **LinkedIn:** [seu-perfil](https://linkedin.com/in/seu-perfil)
- **Frontend:** _adicione o link do repositório do frontend, se público_

---

<p align="center">
  <sub>Projeto desenvolvido com foco em código limpo, separação de responsabilidades e deploy reproduzível.</sub>
</p>
