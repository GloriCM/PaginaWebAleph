/**
 * Worker de producción: sirve el build de Vite y reenvía /api/* al backend Express.
 */
interface Env {
  ASSETS: Fetcher
  API_ORIGIN: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      const origin = (env.API_ORIGIN ?? '').replace(/\/$/, '')
      if (!origin) {
        return Response.json(
          { error: 'API no configurada. Define API_ORIGIN en Cloudflare.' },
          { status: 503 },
        )
      }

      const path = url.pathname.replace(/^\/api\/?/, '')
      const destino = `${origin}/api/${path}${url.search}`
      const headers = new Headers(request.headers)
      headers.delete('host')

      const init: RequestInit = {
        method: request.method,
        headers,
        redirect: 'manual',
      }

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = await request.arrayBuffer()
      }

      try {
        return await fetch(destino, init)
      } catch {
        return Response.json({ error: 'No se pudo conectar con la API.' }, { status: 502 })
      }
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
