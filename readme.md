# Full-Stack Web App Template

Containerized web application with a Node.js backend, PostgreSQL database, and a lightweight vanilla-JS frontend using a custom router. Served through Nginx and orchestrated with Docker Compose.

---

## Architecture

nginx/
conf.d/template.conf # Reverse proxy and static serving
backend/
src/
index.js # App entry
psql.js # PostgreSQL client
hooks/ # Request validators and middleware
psql_scripts/ # Schema, indexes, seeds
routes/ # REST endpoints
sockets/ # WebSocket handling
package.json
dockerfile
.env # Environment variables
frontend/
template/
index.html
script.js
style.css
library/ # Client, Router, User, Listeners
pages/ # Auth and Home pages
docker-compose.yml

---

## Stack

| Component  | Purpose                       |
| ---------- | ----------------------------- |
| Node.js    | Backend API server            |
| PostgreSQL | Database                      |
| Nginx      | Reverse proxy + static assets |
| Docker     | Containerization              |
| Vanilla JS | Frontend SPA framework        |

---

## Setup

### 1. Environment

Create `.env` inside `/backend`:

```bash
NODE_ENV="dev"

HOST="127.0.0.1"
PORT="3000"

COOKIE_NAME="dev"
COOKIE_SECRET="secret"

POSTGRES_USERNAME="dev"
POSTGRES_PASSWORD="dev"
POSTGRES_HOST="127.0.0.1"
POSTGRES_PORT="5432"
POSTGRES_DB ="postgres"

BCRYPT_SALTROUNDS="1" # recommended 10-12
```

2. Run
   docker-compose up --build

Backend runs on http://localhost:8080, frontend served through Nginx at http://localhost.

3. Database

Tables and seeds are in:

backend/src/psql_scripts/

Development
Command Description
docker-compose up Start full stack
npm install (backend) Install dependencies
npm run dev Local dev mode (no Docker)
Frontend Routing

Minimal SPA with client-side routing via Router.js. Pages under /pages/ map to URL paths. Client.js handles API calls; User.js manages session and auth state.

Backend Hooks
Hook Description
bodyParamsValidator.js Validates incoming JSON
cookieValidator.js Ensures session tokens
permissionsValidator.js Role-based access check
License

MIT

Author

Dev template by Kiri.
