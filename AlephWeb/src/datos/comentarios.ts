/**
 * @file comentarios.ts
 * @description Comentarios/testimonios de clientes vía API PostgreSQL.
 */

import type { Testimonio } from '../tipos/indice'
import { crearComentarioApi, obtenerComentariosApi, verificarApiDisponible } from '../servicios/api'

/** Datos mínimos para publicar un comentario. */
export type DatosComentario = {
  name: string
  company: string
  role: string
  content: string
  rating: number
}

function mapComentarioApi(datos: {
  id: string
  name: string
  company: string
  role: string
  content: string
  rating: number
}): Testimonio {
  return {
    id: datos.id,
    name: datos.name,
    company: datos.company ?? '',
    role: datos.role ?? '',
    content: datos.content,
    rating: datos.rating,
  }
}

/** Publica un comentario en la base de datos (visible para todos los visitantes). */
export async function guardarComentario(datos: DatosComentario): Promise<Testimonio> {
  if (!(await verificarApiDisponible())) {
    throw new Error('No se pudo publicar el comentario. El servidor no está disponible.')
  }

  const guardado = await crearComentarioApi({
    ...datos,
    rating: Math.min(5, Math.max(1, Math.round(datos.rating) || 5)),
  })

  return mapComentarioApi(guardado)
}

/** Obtiene comentarios publicados por visitantes desde la API. */
export async function cargarComentariosPublicos(): Promise<Testimonio[]> {
  if (!(await verificarApiDisponible())) {
    return []
  }

  try {
    const lista = await obtenerComentariosApi()
    return lista.map(mapComentarioApi)
  } catch (error) {
    console.warn('No se pudieron cargar comentarios desde API:', error)
    return []
  }
}
