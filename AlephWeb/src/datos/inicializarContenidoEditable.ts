/**
 * Arranque: carga contenido guardado antes de montar React.
 */

import {
  contenidoInicioPorDefecto,
  fusionarContenidoInicio,
  normalizarContenidoInicio,
  CLAVE_CONTENIDO_INICIO,
} from './contenidoInicio'
import { establecerCacheContenidoInicio } from './cacheContenidoInicio'
import { leerDatoSitio } from '../utilidades/almacenamientoSitio'
import { cargarBannerVacantes } from './vacantesRRHH'
import { cargarCatalogoProductos } from './catalogoProductos'

export async function inicializarContenidoEditable() {
  const guardado = await leerDatoSitio<Partial<typeof contenidoInicioPorDefecto>>(CLAVE_CONTENIDO_INICIO)
  const contenido = guardado
    ? normalizarContenidoInicio(fusionarContenidoInicio(guardado))
    : { ...contenidoInicioPorDefecto }

  establecerCacheContenidoInicio(contenido)
  await Promise.all([cargarBannerVacantes(), cargarCatalogoProductos()])
}
