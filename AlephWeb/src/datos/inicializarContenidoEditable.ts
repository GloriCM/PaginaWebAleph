/**
 * Arranque: carga contenido y catálogo desde la API.
 */

import { cargarContenidoInicioDesdeApi } from './contenidoInicio'
import { cargarContenidoEditorialDesdeApi } from './contenidoEditorial'
import { cargarBannerVacantes } from './vacantesRRHH'
import { cargarCatalogoProductos } from './catalogoProductos'

export async function inicializarContenidoEditable() {
  await Promise.all([
    cargarContenidoInicioDesdeApi(),
    cargarContenidoEditorialDesdeApi(),
    cargarBannerVacantes(),
    cargarCatalogoProductos(),
  ])
}
