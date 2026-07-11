/**
 * @file comentarios.ts
 * @description Persistencia local de comentarios/testimonios dejados por clientes.
 * @module datos/comentarios
 */

import type { Testimonio } from '../tipos/indice'

/** Clave de almacenamiento en localStorage. */
const CLAVE_COMENTARIOS = 'aleph_comentarios'

/** Datos mínimos para publicar un comentario. */
export type DatosComentario = {
  name: string
  company: string
  role: string
  content: string
  rating: number
}

/**
 * Guarda un comentario de cliente en localStorage.
 */
export function guardarComentario(datos: DatosComentario): Testimonio {
  const comentarios = obtenerComentarios()
  const nuevo: Testimonio = {
    ...datos,
    id: crypto.randomUUID(),
    rating: Math.min(5, Math.max(1, Math.round(datos.rating) || 5)),
  }
  comentarios.push(nuevo)
  localStorage.setItem(CLAVE_COMENTARIOS, JSON.stringify(comentarios))
  return nuevo
}

/**
 * Obtiene los comentarios publicados por clientes.
 */
export function obtenerComentarios(): Testimonio[] {
  try {
    const datos = localStorage.getItem(CLAVE_COMENTARIOS)
    return datos ? JSON.parse(datos) : []
  } catch {
    return []
  }
}
