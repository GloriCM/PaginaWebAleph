# Base de datos Aleph Web

## Requisitos
- PostgreSQL 14+

## Instalación rápida (Windows)

```powershell
# 1. Crear base de datos
psql -U postgres -c "CREATE DATABASE aleph_web;"

# 2. Aplicar esquema y datos
psql -U postgres -d aleph_web -f database/002_esquema.sql
psql -U postgres -d aleph_web -f database/003_datos_iniciales.sql

# 3. Configurar API
copy server\.env.example server\.env
# Editar server\.env con tu contraseña de PostgreSQL

# 4. Instalar dependencias y crear admin
cd server
npm install
npm run seed

# 5. Iniciar API
npm run dev
```

## Credenciales admin
- Email: `admin@aleph.com`
- Contraseña: `admin123`

## Frontend
```powershell
cd AlephWeb
npm run dev
```

El proxy de Vite redirige `/api` → `http://localhost:3001`.
