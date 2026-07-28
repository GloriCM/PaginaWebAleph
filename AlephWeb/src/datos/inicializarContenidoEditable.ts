/**
 * Arranque: carga contenido desde la API sin bloquear el primer render.
 */

import { cargarContenidoInicioDesdeApi } from './contenidoInicio'
import { cargarContenidoEditorialDesdeApi } from './contenidoEditorial'
import { cargarBannerVacantes } from './vacantesRRHH'
import { cargarCatalogoProductos } from './catalogoProductos'

function cargarContenidoSecundario() {
  void Promise.all([
    cargarContenidoEditorialDesdeApi(),
    cargarBannerVacantes(),
    cargarCatalogoProductos(),
  ])
}

export function inicializarContenidoEditable() {
  void cargarContenidoInicioDesdeApi()

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => cargarContenidoSecundario(), { timeout: 2500 })
  } else {
    setTimeout(cargarContenidoSecundario, 100)
  }
}
