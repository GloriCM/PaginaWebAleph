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
      <p className="admin-subtitle">Solicitudes de contacto, cotización y postulaciones (RF-008)</p>

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
              <th>CV</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud.id}>
                <td>{new Date(solicitud.createdAt).toLocaleString('es-CO')}</td>
                <td>
                  {solicitud.type === 'quote'
                    ? 'Cotización'
                    : solicitud.type === 'job'
                      ? 'Postulación'
                      : 'Contacto'}
                </td>
                <td>{solicitud.name}</td>
                <td>{solicitud.company || solicitud.role || '—'}</td>
                <td>{solicitud.email}</td>
                <td>{solicitud.phone}</td>
                <td>{solicitud.city}</td>
                <td>
                  {solicitud.type === 'quote' && solicitud.quoteData
                    ? `${solicitud.quoteData.product} · ${solicitud.quoteData.quantity}`
                    : solicitud.type === 'job' && solicitud.jobData
                      ? `${solicitud.jobData.areaLabel ?? solicitud.jobData.area}${solicitud.jobData.cvFileName ? ` · ${solicitud.jobData.cvFileName}` : ''}${solicitud.jobData.emailEnviadoA ? ` → ${solicitud.jobData.emailEnviadoA}` : ''}`
                      : solicitud.message}
                </td>
                <td>
                  {solicitud.type === 'job' && solicitud.jobData?.cvDataUrl ? (
                    <a
                      href={solicitud.jobData.cvDataUrl}
                      download={solicitud.jobData.cvFileName ?? 'hoja-de-vida'}
                      className="admin-table__cv-link"
                    >
                      Descargar
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
