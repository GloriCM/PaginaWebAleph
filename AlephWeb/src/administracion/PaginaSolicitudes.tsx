/**
 * @file PaginaSolicitudes.tsx
 * @description Gestión de solicitudes desde PostgreSQL (RF-008).
 */

import { useEffect, useState } from 'react'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { obtenerSolicitudes } from '../datos/solicitudes'
import type { SolicitudCliente } from '../tipos/indice'

export function PaginaSolicitudes() {
  const [solicitudes, setSolicitudes] = useState<SolicitudCliente[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    obtenerSolicitudes()
      .then(setSolicitudes)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar solicitudes'))
      .finally(() => setCargando(false))
  }, [])

  return (
    <>
      <MetaPagina title="Admin - Solicitudes" />
      <h1>Clientes potenciales</h1>
      <p className="admin-subtitle">Solicitudes de contacto, cotización y postulaciones (RF-008)</p>

      {cargando && <p>Cargando solicitudes…</p>}
      {error && <p className="admin-login__error">{error}</p>}

      {!cargando && !error && solicitudes.length === 0 ? (
        <p>No hay solicitudes registradas todavía.</p>
      ) : (
        !cargando &&
        !error && (
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
                        ? `${solicitud.jobData.areaLabel ?? solicitud.jobData.area}${solicitud.jobData.cvFileName ? ` · ${solicitud.jobData.cvFileName}` : ''}`
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
        )
      )}
    </>
  )
}
