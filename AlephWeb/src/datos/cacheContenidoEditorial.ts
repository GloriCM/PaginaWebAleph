/**
 * Caché en memoria del contenido editorial del sitio.
 */

import type { ContenidoEditorial } from './contenidoEditorial'

let cache: ContenidoEditorial | null = null

export function establecerCacheContenidoEditorial(contenido: ContenidoEditorial) {
  cache = contenido
}

export function obtenerCacheContenidoEditorial() {
  return cache
}
