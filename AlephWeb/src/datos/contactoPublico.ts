/**
 * Datos de contacto públicos (admin inicio + fallback configuracionSitio).
 */

import { configuracionSitio } from './configuracionSitio'
import { obtenerContenidoInicio } from './contenidoInicio'
import { resolverUrlMapa } from '../utilidades/mapaEmbed'

export function obtenerContactoPublico() {
  const contacto = obtenerContenidoInicio().contacto

  return {
    direccion: contacto.direccion || configuracionSitio.address,
    telefono: contacto.telefono || configuracionSitio.phone,
    email: contacto.email || configuracionSitio.email,
    mapEmbedUrl: resolverUrlMapa(
      contacto.direccion || configuracionSitio.address,
      contacto.mapEmbedUrl,
    ),
  }
}
