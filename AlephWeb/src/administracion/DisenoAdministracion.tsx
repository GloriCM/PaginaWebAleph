/**
 * @file DisenoAdministracion.tsx
 * @description Layout del panel administrativo con barra lateral de navegaci?n,
 * protecci?n de rutas autenticadas y ruta invitada para el login.
 * @module administracion/DisenoAdministracion
 */

import type { ReactNode } from 'react'
import { Navigate, Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { LogoAleph } from '../componentes/interfaz/LogoAleph'
import { RUTA_ACCESO, RUTA_GESTION } from '../config/accesoAdmin'

const G = RUTA_GESTION

function estaAutenticado() {
  return sessionStorage.getItem('aleph_admin') === 'true'
}

export function DisenoAdministracion() {
  const navigate = useNavigate()

  if (!estaAutenticado()) {
    return <Navigate to={RUTA_ACCESO} replace />
  }

  function cerrarSesion() {
    sessionStorage.removeItem('aleph_admin')
    navigate(RUTA_ACCESO)
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <LogoAleph variant="claro" className="admin-sidebar__logo" />
        <nav>
          <NavLink to={G} end>Dashboard</NavLink>
          <NavLink to={`${G}/inicio`}>P?gina de inicio</NavLink>
          <NavLink to={`${G}/productos`}>Productos</NavLink>
          <NavLink to={`${G}/imagenes`}>Im?genes</NavLink>
          <NavLink to={`${G}/vacantes`}>Vacantes RRHH</NavLink>
          <NavLink to={`${G}/leads`}>Solicitudes</NavLink>
          <NavLink to={`${G}/usuarios`}>Usuarios</NavLink>
        </nav>
        <button type="button" onClick={cerrarSesion} className="admin-sidebar__logout">
          Cerrar sesi?n
        </button>
        <Link to="/" className="admin-sidebar__site">? Ver sitio</Link>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

interface PropiedadesRutaInvitadoAdmin {
  children: ReactNode
}

export function RutaInvitadoAdmin({ children }: PropiedadesRutaInvitadoAdmin) {
  if (estaAutenticado()) {
    return <Navigate to={RUTA_GESTION} replace />
  }
  return children
}
