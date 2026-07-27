/**
 * @file solicitudes.ts
 * @description Solicitudes de contacto, cotización y postulaciones vía API.
 */

import type { SolicitudCliente } from '../tipos/indice'
import {
  enviarSolicitudApi,
  haySesionAdmin,
  obtenerSolicitudesApi,
  verificarApiDisponible,
} from '../servicios/api'

export async function guardarSolicitud(
  solicitud: Omit<SolicitudCliente, 'id' | 'createdAt'>,
): Promise<SolicitudCliente> {
  if (await verificarApiDisponible()) {
    return enviarSolicitudApi(solicitud)
  }

  throw new Error(
    'No se pudo enviar la solicitud. Verifica que el servidor API esté en ejecución.',
  )
}

export async function obtenerSolicitudes(): Promise<SolicitudCliente[]> {
  if (haySesionAdmin() && (await verificarApiDisponible())) {
    return obtenerSolicitudesApi()
  }
  return []
}
