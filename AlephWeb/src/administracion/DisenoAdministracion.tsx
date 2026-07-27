/**
 * @file DisenoAdministracion.tsx
 * @description Layout del panel administrativo con JWT y API PostgreSQL.
 */

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Navigate, Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { LogoAleph } from '../componentes/interfaz/LogoAleph'
import { RUTA_ACCESO, RUTA_GESTION } from '../config/accesoAdmin'
import { useAuthAdmin } from '../hooks/useAuthAdmin'
import { cargarCatalogoProductos } from '../datos/catalogoProductos'
import { cargarContenidoEditorialDesdeApi } from '../datos/contenidoEditorial'
import { cargarContenidoInicioDesdeApi } from '../datos/contenidoInicio'
import { cargarBannerVacantes } from '../datos/vacantesRRHH'

const G = RUTA_GESTION

export function DisenoAdministracion() {
  const navigate = useNavigate()
  const { validando, autenticado, apiDisponible, cerrarSesion } = useAuthAdmin()

  useEffect(() => {
    if (!autenticado) return
    void Promise.all([
      cargarCatalogoProductos(),
      cargarContenidoInicioDesdeApi(),
      cargarContenidoEditorialDesdeApi(),
      cargarBannerVacantes(),
    ])
  }, [autenticado])

  if (validando) {
    return (
      <div className="admin-login">
        <p className="admin-login__cargando">Verificando sesi?n?</p>
      </div>
    )
  }

  if (!autenticado) {
    return <Navigate to={RUTA_ACCESO} replace />
  }

  function manejarCerrarSesion() {
    cerrarSesion()
    navigate(RUTA_ACCESO)
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <LogoAleph variant="claro" className="admin-sidebar__logo" />
        {!apiDisponible && (
          <p className="admin-sidebar__alerta" role="alert">
            API no disponible. Ejecuta el servidor en <code>server/</code> (puerto 3001).
          </p>
        )}
        {apiDisponible && (
          <p className="admin-sidebar__ok" role="status">
            Conectado a PostgreSQL
          </p>
        )}
        <nav>
          <NavLink to={G} end>Dashboard</NavLink>
          <NavLink to={`${G}/inicio`}>P?gina de inicio</NavLink>
          <NavLink to={`${G}/contenido`}>Contenido editorial</NavLink>
          <NavLink to={`${G}/productos`}>Productos</NavLink>
          <NavLink to={`${G}/imagenes`}>Im?genes</NavLink>
          <NavLink to={`${G}/vacantes`}>Vacantes RRHH</NavLink>
          <NavLink to={`${G}/leads`}>Solicitudes</NavLink>
          <NavLink to={`${G}/usuarios`}>Usuarios</NavLink>
        </nav>
        <button type="button" onClick={manejarCerrarSesion} className="admin-sidebar__logout">
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
  const { validando, autenticado } = useAuthAdmin()

  if (validando) {
    return (
      <div className="admin-login">
        <p className="admin-login__cargando">Cargando?</p>
      </div>
    )
  }

  if (autenticado) {
    return <Navigate to={RUTA_GESTION} replace />
  }

  return children
}
