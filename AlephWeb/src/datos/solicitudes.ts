/**
 * @file solicitudes.ts
 * @description Servicio de persistencia local para solicitudes de contacto y cotización.
 * Implementa RF-008 (gestión de clientes potenciales) usando localStorage.
 * En producción debe reemplazarse por una API/backend.
 * @module datos/solicitudes
 */

import type { SolicitudCliente } from '../tipos/indice'

/** Clave de almacenamiento en localStorage para las solicitudes. */
const CLAVE_SOLICITUDES = 'aleph_leads'

/**
 * Guarda una nueva solicitud de contacto o cotización.
 * @param solicitud - Datos de la solicitud sin id ni fecha de creación.
 * @returns La solicitud guardada con id y timestamp.
 */
export function guardarSolicitud(solicitud: Omit<SolicitudCliente, 'id' | 'createdAt'>) {
  const solicitudes = obtenerSolicitudes()
  const nuevaSolicitud: SolicitudCliente = {
    ...solicitud,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  solicitudes.push(nuevaSolicitud)
  localStorage.setItem(CLAVE_SOLICITUDES, JSON.stringify(solicitudes))
  return nuevaSolicitud
}

/**
 * Obtiene todas las solicitudes almacenadas localmente.
 * @returns Lista de solicitudes o arreglo vacío si no hay datos.
 */
export function obtenerSolicitudes(): SolicitudCliente[] {
  try {
    const datos = localStorage.getItem(CLAVE_SOLICITUDES)
    return datos ? JSON.parse(datos) : []
  } catch {
    return []
  }
}
