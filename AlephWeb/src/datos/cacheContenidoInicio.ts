/**
 * Caché en memoria del contenido de inicio (cargado desde IndexedDB al arrancar).
 */

import type { ContenidoInicio } from './contenidoInicio'

let cache: ContenidoInicio | null = null
let listo = false
const esperas: Array<(valor: ContenidoInicio) => void> = []

export function establecerCacheContenidoInicio(contenido: ContenidoInicio) {
  cache = contenido
  listo = true
  esperas.splice(0).forEach((resolver) => resolver(contenido))
}

export function obtenerCacheContenidoInicio(): ContenidoInicio | null {
  return cache
}

export function contenidoInicioEstaListo() {
  return listo
}

export function esperarContenidoInicio(): Promise<ContenidoInicio> {
  if (cache) return Promise.resolve(cache)
  return new Promise((resolve) => esperas.push(resolve))
}
