/**
 * @file PaginaPanelAdministracion.tsx
 * @description Dashboard del panel administrativo con métricas resumidas
 * de productos, noticias y solicitudes, además de las últimas solicitudes recibidas.
 * @module administracion/PaginaPanelAdministracion
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { obtenerSolicitudes } from '../datos/solicitudes'
import { productos } from '../datos/productos'
import { noticias } from '../datos/contenido'

/**
 * Vista principal del panel con estadísticas y tabla de solicitudes recientes.
 * Muestra los cinco registros más recientes en orden descendente por fecha.
 */
export function PaginaPanelAdministracion() {
  const solicitudes = obtenerSolicitudes()

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
                  <td>{solicitud.type === 'quote' ? 'Cotización' : 'Contacto'}</td>
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
