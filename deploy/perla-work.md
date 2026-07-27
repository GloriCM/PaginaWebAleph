# Despliegue Aleph en perla.work
#
# Arquitectura recomendada:
#   aleph.perla.work      → Worker paginawebaleph (frontend React)
#   api.aleph.perla.work  → Túnel cloudflared → localhost:3001 (Express)

# ---------------------------------------------------------------------------
# 1) CLOUDflare WORKER (paginawebaleph)
# ---------------------------------------------------------------------------
# Settings → Variables and secrets (Production):
#   API_ORIGIN = https://api.aleph.perla.work
#
# Settings → Build:
#   Root directory = AlephWeb
#   Build command  = npm ci && npm run build
#   Deploy command = npx wrangler deploy
#
# Domains → Add domain → aleph.perla.work
# (Cloudflare crea el DNS automáticamente si perla.work está en tu cuenta)

# ---------------------------------------------------------------------------
# 2) TÚNEL — API Express (puerto 3001)
# ---------------------------------------------------------------------------
# Puedes usar el túnel de perla.work y añadir una regla MÁS arriba del catch-all,
# o crear un túnel nuevo solo para la API. Ejemplo añadiendo al túnel existente:

# tunnel: TU_TUNNEL_PERLA   # el nombre/id de tu túnel perla.work
# credentials-file: C:\Users\TU_USUARIO\.cloudflared\TU_TUNNEL_ID.json

ingress:
  # NUEVA regla — debe ir ANTES que perla.work y antes del 404 final
  - hostname: api.aleph.perla.work
    service: http://localhost:3001

  # Tus reglas actuales (ejemplo):
  # - hostname: perla.work
  #   service: http://localhost:8080
  # - hostname: perlax.perla.work
  #   service: http://localhost:OTRO_PUERTO

  - service: http_status:404

# DNS (si no lo crea solo el panel):
#   cloudflared tunnel route dns TU_TUNNEL_PERLA api.aleph.perla.work

# ---------------------------------------------------------------------------
# 3) server/.env (en el servidor donde corre PostgreSQL + Express)
# ---------------------------------------------------------------------------
# CORS_ORIGIN=https://aleph.perla.work
# PORT=3001
# (resto de DB, SMTP, etc.)

# ---------------------------------------------------------------------------
# 4) Comprobar
# ---------------------------------------------------------------------------
# https://api.aleph.perla.work/api/health  → {"ok":true,"db":true}
# https://aleph.perla.work                 → sitio web
# Formulario contacto en aleph.perla.work  → sin error 502
