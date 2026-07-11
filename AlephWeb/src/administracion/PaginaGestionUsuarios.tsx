/**
 * @file PaginaGestionUsuarios.tsx
 * @description Módulo de gestión de usuarios administradores del panel.
 * Lista usuarios con rol y acciones de edición (RF-022).
 * Los datos son de demostración hasta conectar con el backend de autenticación.
 * @module administracion/PaginaGestionUsuarios
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'

/** Usuarios de demostración del panel administrativo. */
const usuarios = [
  { id: '1', name: 'Administrador', email: 'admin@aleph.com', role: 'admin' },
  { id: '2', name: 'Editor de contenido', email: 'editor@aleph.com', role: 'editor' },
]

/**
 * Vista de listado de usuarios administradores con nombre, email, rol y acciones.
 * El botón de nuevo usuario y edición están deshabilitados hasta integrar el backend.
 */
export function PaginaGestionUsuarios() {
  return (
    <>
      <MetaPagina title="Admin - Usuarios" />
      <div className="admin-header-row">
        <div>
          <h1>Usuarios administradores</h1>
          <p className="admin-subtitle">Gestión de usuarios del panel (RF-022)</p>
        </div>
        <button type="button" className="btn btn--primary" disabled>
          + Nuevo usuario
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>{usuario.role === 'admin' ? 'Administrador' : 'Editor'}</td>
              <td>
                <button type="button" className="btn btn--ghost btn--sm" disabled>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
