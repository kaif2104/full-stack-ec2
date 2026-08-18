# Full-Stack EC2 Deployment Project

This repository contains a complete production-style full-stack application pattern for a React frontend, ASP.NET Core Web API backend, and PostgreSQL database deployed on an AWS EC2 instance with IIS.

## Architecture

User -> React Frontend (IIS) -> ASP.NET Core Web API -> PostgreSQL

- Frontend: React + Vite
- Backend: ASP.NET Core Web API (.NET 8)
- Database: PostgreSQL 16
- Web server: IIS on Windows Server EC2
- API doc: Swagger UI

## Project Structure

- `frontend/` - React application
- `backend/FullStack.Api/` - .NET Web API
- `sql/` - database schema and seed data
- `scripts/` - Windows Server deployment scripts
- `docker-compose.yml` - local PostgreSQL + API environment

## Why this architecture works

This is the standard full-stack deployment flow:

1. Users request the React site from the browser.
2. IIS serves the static frontend files.
3. The frontend calls the backend API using an HTTP URL.
4. The ASP.NET API connects to PostgreSQL using the configured connection string.
5. Swagger exposes the backend endpoints for testing.

This separation keeps frontend and backend independent while making deployment simpler and production-ready.

## Step-by-step EC2 deployment process

### 1. Launch a Windows Server EC2 instance

Create an EC2 instance with:

- Windows Server 2022 or later
- Public IP or Elastic IP
- Security Group allowing inbound HTTP (80), HTTPS (443), and PostgreSQL (5432)
- Remote Desktop (RDP) access enabled

### 2. Install PostgreSQL

Install PostgreSQL on the EC2 instance or use a managed PostgreSQL resource. Then create the database and table.

Example SQL:

```sql
CREATE DATABASE fullstack_ec2;

CREATE TABLE IF NOT EXISTS public."Todos" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(200) NOT NULL,
    "Description" VARCHAR(1000),
    "IsComplete" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "UpdatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3. Publish the ASP.NET API

On the EC2 server, run:

```powershell
dotnet publish .\backend\FullStack.Api\FullStack.Api.csproj -c Release -o C:\services\FullStackApi
```

Set the database connection string in the environment or appsettings:

```powershell
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Database=fullstack_ec2;Username=postgres;Password=postgres;Port=5432"
```

### 4. Configure IIS

Use IIS to serve the React frontend and to host the API application.

Recommended layout:

```text
C:\inetpub\wwwroot\fullstack-ec2\frontend
C:\services\FullStackApi
```

Create a site for the frontend and an application or separate site for the backend API.

### 5. Build the React frontend

From the repo on the EC2 instance:

```powershell
cd frontend
npm install
npm run build
```

Copy the generated `dist` folder to the IIS static directory:

```powershell
Copy-Item .\dist\* "C:\inetpub\wwwroot\fullstack-ec2\frontend" -Recurse -Force
```

Set the frontend env variable:

```env
VITE_API_URL=http://<EC2_PUBLIC_IP>/api
```

### 6. Access Swagger and test API endpoints

Once the backend is running, open the Swagger page:

```text
http://<EC2_PUBLIC_IP>/swagger
```

Test the following routes:

- GET `/api/todos`
- GET `/api/todos/{id}`
- POST `/api/todos`
- PUT `/api/todos/{id}`
- DELETE `/api/todos/{id}`
- GET `/api/health`

### 7. Verify frontend-to-backend communication

The React app uses the backend URL from `VITE_API_URL` to fetch and manage tasks. If the API is online and the database is connected, CRUD operations should work end-to-end.

## Local development

You can run the backend and PostgreSQL locally with Docker:

```bash
docker compose up --build
```

Then open:

- Frontend dev server: `http://localhost:5173`
- Swagger API: `http://localhost:5080/swagger`
- PostgreSQL: `localhost:5432`

## API behavior

The included backend exposes a simple `TodoItem` model to demonstrate CRUD operations in a production-style setup.

## Important deployment checklist

- EC2 instance is running
- Public IP assigned
- Security group allows required ports
- PostgreSQL is installed and reachable
- API is published and running
- IIS serves the frontend and backend
- React app is pointing to the correct backend URL
- Swagger works and CRUD operations succeed
- Frontend loads and interacts correctly with the API

## Repository push

```bash
git init
git add .
git commit -m "Initial EC2 deployment app"
git branch -M main
git remote add origin <your-github-url>
git push -u origin main
```

## Included files

- `backend/FullStack.Api/` - ASP.NET Core API code
- `frontend/` - React UI code and Vite configuration
- `scripts/` - EC2 setup and deployment scripts
- `docker-compose.yml` - local environment definition
- `sql/init.sql` - PostgreSQL seed schema
