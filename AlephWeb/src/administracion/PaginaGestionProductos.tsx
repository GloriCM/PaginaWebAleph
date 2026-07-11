/**
 * @file PaginaGestionProductos.tsx
 * @description Módulo de gestión de productos del portafolio en el panel administrativo.
 * Lista productos con su categoría y acciones de edición/eliminación (RF-020).
 * El CRUD completo se conectará al backend en una fase posterior.
 * @module administracion/PaginaGestionProductos
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { productos } from '../datos/productos'
import { categorias } from '../datos/categorias'

/**
 * Vista de listado de productos con imagen, categoría y acciones.
 * Los botones de crear, editar y eliminar están deshabilitados hasta integrar el backend.
 */
export function PaginaGestionProductos() {
  return (
    <>
      <MetaPagina title="Admin - Productos" />
      <div className="admin-header-row">
        <div>
          <h1>Gestión de productos</h1>
          <p className="admin-subtitle">Crear, modificar y eliminar productos del portafolio (RF-020)</p>
        </div>
        <button type="button" className="btn btn--primary" disabled>
          + Nuevo producto
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => {
            const categoria = categorias.find((c) => c.id === producto.categoryId)
            return (
              <tr key={producto.id}>
                <td>
                  <div className="admin-table__product">
                    <img src={producto.image} alt="" width="48" height="32" />
                    {producto.name}
                  </div>
                </td>
                <td>{categoria?.name}</td>
                <td>
                  <button type="button" className="btn btn--ghost btn--sm" disabled>Editar</button>
                  <button type="button" className="btn btn--ghost btn--sm" disabled>Eliminar</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="admin-note">
        El CRUD completo se conectará al backend. Esta vista muestra la estructura del módulo administrativo.
      </p>
    </>
  )
}
