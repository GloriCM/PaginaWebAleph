/**
 * Proxy /api/* hacia el servidor Express en producción.
 * Configura la variable API_ORIGIN en Cloudflare Pages (ej. https://api.tudominio.com).
 */
interface Env {
  API_ORIGIN: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const origin = (context.env.API_ORIGIN ?? '').replace(/\/$/, '')
  if (!origin) {
    return new Response(
      JSON.stringify({
        error: 'API no configurada. Define API_ORIGIN en Cloudflare Pages.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const segmentos = context.params.path
  const pathParam = Array.isArray(segmentos) ? segmentos.join('/') : segmentos ?? ''
  const url = new URL(context.request.url)
  const destino = `${origin}/api/${pathParam}${url.search}`

  const headers = new Headers(context.request.headers)
  headers.delete('host')

  const init: RequestInit = {
    method: context.request.method,
    headers,
    redirect: 'manual',
  }

  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    init.body = await context.request.arrayBuffer()
  }

  try {
    const respuesta = await fetch(destino, init)
    return new Response(respuesta.body, {
      status: respuesta.status,
      statusText: respuesta.statusText,
      headers: respuesta.headers,
    })
  } catch {
    return new Response(
      JSON.stringify({ error: 'No se pudo conectar con la API.' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
