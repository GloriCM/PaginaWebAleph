# Aleph Web — despliegue en Cloudflare Pages

Guía para publicar el sitio en **Cloudflare Pages** y conectar la **API Express + PostgreSQL**.

## Arquitectura

```
Visitante
   │
   ▼
Cloudflare Pages  (React / Vite)     ← aleph.tudominio.com
   │
   │  /api/*
   ▼
Cloudflare Tunnel o servidor público  ← api.tudominio.com
   │
   ▼
Express (server/) + PostgreSQL
```

- **Frontend:** ideal para Cloudflare Pages (archivos estáticos).
- **Backend:** Express + PostgreSQL **no** corre dentro de Pages; debe estar en un servidor con túnel o hosting (VPS, Railway, Render, etc.).

---

## Parte 1 — Frontend en Cloudflare Pages

### 1. Subir el código a GitHub

El repositorio ya está en: `https://github.com/GloriCM/PaginaWebAleph`

Asegúrate de que los cambios estén en la rama `main` (push desde tu PC).

### 2. Crear proyecto en Cloudflare

1. Entra a [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Autoriza GitHub y elige el repo `PaginaWebAleph`
4. Configuración de build:

| Campo | Valor |
|--------|--------|
| **Production branch** | `main` |
| **Root directory** | `AlephWeb` |
| **Build command** | `npm ci && npm run build` |
| **Build output directory** | `dist` |

5. **Environment variables** (Production):

| Variable | Valor | Notas |
|----------|--------|--------|
| `NODE_VERSION` | `20` | Versión de Node en el build |
| `API_ORIGIN` | `https://api.tudominio.com` | URL pública de tu API (sin `/api` al final) |

6. **Save and Deploy**

El archivo `public/_redirects` ya incluye la regla SPA (`/* → index.html`).

La carpeta `functions/api/` hace de proxy: las peticiones a `/api/...` del sitio se reenvían a `API_ORIGIN`.

### 3. Dominio personalizado (opcional)

En el proyecto Pages → **Custom domains** → añade por ejemplo `www.alephimpresores.com`.

---

## Parte 2 — API en tu servidor (Cloudflare Tunnel)

Si la API y PostgreSQL corren en el mismo servidor Windows donde desarrollas:

### 1. Instalar cloudflared

Descarga desde: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

### 2. Iniciar sesión y crear túnel

```powershell
cloudflared tunnel login
cloudflared tunnel create aleph-api
```

### 3. Configurar el túnel

Copia `deploy/cloudflared.example.yml` y edítalo con tu `credentials-file` y hostname.

Ejemplo de ruta DNS en Cloudflare:

```powershell
cloudflared tunnel route dns aleph-api api.tudominio.com
```

### 4. Ejecutar el túnel (prueba)

```powershell
cloudflared tunnel --config C:\ruta\a\tu-config.yml run aleph-api
```

### 5. API siempre encendida

- Instala el túnel como **servicio de Windows**, o
- Usa **NSSM** / Programador de tareas para `npm run start` en `server/` y `cloudflared tunnel run`.

### 6. Variables del servidor (`server/.env`)

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aleph_web
DB_USER=postgres
DB_PASSWORD=tu_password_seguro
JWT_SECRET=genera_un_secreto_largo_aleatorio
CORS_ORIGIN=https://aleph.tudominio.com,https://www.alephimpresores.com
EMAIL_RRHH=gestionhumana@grupoelliot.com
EMAIL_SERVICIO_CLIENTE=servicioalcliente@grupoelliot.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=...
SMTP_FROM_NAME=Notificaciones Aleph
```

**Importante:** `CORS_ORIGIN` debe incluir la URL exacta de tu sitio en Cloudflare Pages.

---

## Parte 3 — Verificación

1. Abre tu sitio en Pages: debe cargar Inicio, Servicios, etc.
2. Prueba **Contáctanos** o **Cotización** → debe responder sin error 502.
3. Admin: `https://tudominio.com/aleph-cmyk-gestion-7k2m/acceso`

Si ves **502** o **API no configurada**:

- Revisa `API_ORIGIN` en Cloudflare Pages.
- Comprueba que el túnel y `npm run start` en `server/` estén activos.
- Prueba directo: `https://api.tudominio.com/api/health` → `{"ok":true,"db":true}`

---

## Despliegue manual (sin Git)

Desde la carpeta `AlephWeb`:

```powershell
npm ci
npm run build
npx wrangler pages deploy dist --project-name=aleph-web
```

(Necesitas `wrangler login` y el proyecto creado antes en el panel.)

---

## Alternativa: API en Railway / Render

Si no quieres mantener un túnel en Windows:

1. PostgreSQL gestionado (Neon, Supabase, Railway).
2. Despliega la carpeta `server/` como servicio Node.
3. Usa esa URL pública como `API_ORIGIN` en Pages.

---

## Resumen de archivos añadidos

| Archivo | Función |
|---------|---------|
| `AlephWeb/public/_redirects` | Rutas SPA en Pages |
| `AlephWeb/functions/api/[[path]].ts` | Proxy `/api` → backend |
| `AlephWeb/wrangler.toml` | Config Wrangler / Pages |
| `deploy/cloudflared.example.yml` | Ejemplo de túnel para la API |

---

## ¿Puedo desplegarlo yo por ti?

Desde aquí **no tengo acceso** a tu cuenta de Cloudflare ni a tus credenciales. Lo que sí está listo es la configuración del proyecto; tú solo necesitas:

1. Conectar GitHub en Cloudflare Pages (5–10 min).
2. Poner `API_ORIGIN` y el dominio.
3. Levantar la API con túnel o hosting.

Si me indicas **dominio** (ej. `alephimpresores.com`) y **dónde correrá la API** (mismo servidor Windows / Railway / otro), te detallo los pasos exactos para tu caso.
