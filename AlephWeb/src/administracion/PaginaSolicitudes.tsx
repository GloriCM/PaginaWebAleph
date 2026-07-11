/**
 * @file PaginaSolicitudes.tsx
 * @description Módulo de gestión de clientes potenciales y solicitudes del sitio.
 * Muestra formularios de contacto y cotización almacenados en localStorage (RF-008).
 * @module administracion/PaginaSolicitudes
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { obtenerSolicitudes } from '../datos/solicitudes'

/**
 * Listado completo de solicitudes de contacto y cotización.
 * Ordenadas de la más reciente a la más antigua.
 */
export function PaginaSolicitudes() {
  const solicitudes = obtenerSolicitudes().slice().reverse()

  return (
    <>
      <MetaPagina title="Admin - Solicitudes" />
      <h1>Clientes potenciales</h1>
      <p className="admin-subtitle">Solicitudes de contacto y cotización (RF-008)</p>

      {solicitudes.length === 0 ? (
        <p>No hay solicitudes registradas. Los formularios del sitio las almacenan aquí.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Ciudad</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id}>
                <td>{new Date(solicitud.createdAt).toLocaleString('es-CO')}</td>
                <td>{solicitud.type === 'quote' ? 'Cotización' : 'Contacto'}</td>
                <td>{solicitud.name}</td>
                <td>{solicitud.company || '—'}</td>
                <td>{solicitud.email}</td>
                <td>{solicitud.phone}</td>
                <td>{solicitud.city}</td>
                <td>
                  {solicitud.type === 'quote' && solicitud.quoteData
                    ? `${solicitud.quoteData.product} · ${solicitud.quoteData.quantity}`
                    : solicitud.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
