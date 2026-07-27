/**
 * @file PaginaPanelAdministracion.tsx
 * @description Dashboard del panel administrativo con métricas resumidas
 * de productos, noticias y solicitudes, además de las últimas solicitudes recibidas.
 * @module administracion/PaginaPanelAdministracion
 */

import { useEffect, useState } from 'react'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { obtenerSolicitudes } from '../datos/solicitudes'
import { useProductos } from '../hooks/useProductos'
import { useContenidoEditorial } from '../hooks/useContenidoEditorial'
import type { SolicitudCliente } from '../tipos/indice'

export function PaginaPanelAdministracion() {
  const productos = useProductos()
  const { noticias } = useContenidoEditorial()
  const [solicitudes, setSolicitudes] = useState<SolicitudCliente[]>([])

  useEffect(() => {
    obtenerSolicitudes().then(setSolicitudes).catch(() => setSolicitudes([]))
  }, [])

  return (
    <>
      <MetaPagina title="Admin - Dashboard" />
      <h1>Dashboard</h1>
      <p className="admin-subtitle">Resumen del contenido del sitio web</p>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat__value">{productos.length}</span>
          <span className="admin-stat__label">Productos</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__value">{noticias.length}</span>
          <span className="admin-stat__label">Noticias</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__value">{solicitudes.length}</span>
          <span className="admin-stat__label">Solicitudes</span>
        </div>
      </div>

      <section className="admin-section">
        <h2>Últimas solicitudes</h2>
        {solicitudes.length === 0 ? (
          <p>No hay solicitudes registradas aún.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Ciudad</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.slice(-5).reverse().map((solicitud) => (
                <tr key={solicitud.id}>
                  <td>{new Date(solicitud.createdAt).toLocaleDateString('es-CO')}</td>
                  <td>{solicitud.type === 'quote' ? 'Cotización' : solicitud.type === 'job' ? 'Postulación' : 'Contacto'}</td>
                  <td>{solicitud.name}</td>
                  <td>{solicitud.email}</td>
                  <td>{solicitud.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}
