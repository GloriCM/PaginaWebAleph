/**
 * @file DisenoAdministracion.tsx
 * @description Layout del panel administrativo con barra lateral de navegación,
 * protección de rutas autenticadas y ruta invitada para el login.
 * Implementa RF-019 (acceso restringido al panel) mediante sessionStorage.
 * @module administracion/DisenoAdministracion
 */

import type { ReactNode } from 'react'
import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom'
import logo from '../activos/logo.png'

/**
 * Verifica si el usuario tiene una sesión administrativa activa.
 * @returns `true` si la clave `aleph_admin` está presente en sessionStorage.
 */
function estaAutenticado() {
  return sessionStorage.getItem('aleph_admin') === 'true'
}

/**
 * Layout principal del panel administrativo.
 * Redirige a `/admin/login` si no hay sesión activa.
 * Renderiza la barra lateral con enlaces a los módulos y un `<Outlet />` para el contenido.
 */
export function DisenoAdministracion() {
  const navigate = useNavigate()

  if (!estaAutenticado()) {
    return <Navigate to="/admin/login" replace />
  }

  /** Cierra la sesión administrativa y redirige al formulario de login. */
  function cerrarSesion() {
    sessionStorage.removeItem('aleph_admin')
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <img src={logo} alt="Aleph" className="admin-sidebar__logo" />
        <nav>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/productos">Productos</Link>
          <Link to="/admin/imagenes">Imágenes</Link>
          <Link to="/admin/leads">Solicitudes</Link>
          <Link to="/admin/usuarios">Usuarios</Link>
        </nav>
        <button type="button" onClick={cerrarSesion} className="admin-sidebar__logout">
          Cerrar sesión
        </button>
        <Link to="/" className="admin-sidebar__site">← Ver sitio</Link>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

/** Propiedades del componente de ruta invitada. */
interface PropiedadesRutaInvitadoAdmin {
  /** Contenido a renderizar cuando el usuario no está autenticado. */
  children: ReactNode
}

/**
 * Ruta accesible solo para usuarios no autenticados (p. ej. login).
 * Redirige a `/admin` si ya existe una sesión activa.
 */
export function RutaInvitadoAdmin({ children }: PropiedadesRutaInvitadoAdmin) {
  if (estaAutenticado()) {
    return <Navigate to="/admin" replace />
  }
  return children
}
