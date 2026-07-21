/**
 * Caché en memoria del catálogo de productos.
 */

import type { Producto } from '../tipos/indice'

let cache: Producto[] | null = null

export function establecerCacheProductos(productos: Producto[]) {
  cache = productos.map((p) => ({ ...p }))
}

export function obtenerCacheProductos(): Producto[] | null {
  return cache
}
