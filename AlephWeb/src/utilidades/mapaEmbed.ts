/**
 * Genera la URL del mapa embebido a partir de una dirección en texto.
 */

const PLACEHOLDER_MAPA = /0x0%3A0x0|!2zNMKw/i

export function urlMapaDesdeDireccion(direccion: string): string {
  const consulta = encodeURIComponent(direccion.trim())
  return `https://www.google.com/maps?q=${consulta}&hl=es&z=16&output=embed`
}

export function resolverUrlMapa(direccion: string, mapEmbedUrl?: string | null): string {
  if (mapEmbedUrl && !PLACEHOLDER_MAPA.test(mapEmbedUrl)) {
    return mapEmbedUrl
  }
  return urlMapaDesdeDireccion(direccion)
}
