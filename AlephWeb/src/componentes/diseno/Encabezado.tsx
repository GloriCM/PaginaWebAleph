/**
 * @file Encabezado.tsx
 * @description Barra de navegación principal del sitio (RNF-002).
 * Cápsula flotante con enlaces siempre visibles en la barra.
 * @module componentes/diseno/Encabezado
 */

import { Link, NavLink, useLocation } from 'react-router-dom'
import type { MouseEvent } from 'react'
import { LogoAleph } from '../interfaz/LogoAleph'
import { configuracionSitio } from '../../datos/configuracionSitio'
import { useAccesoSecreto } from '../../hooks/useAccesoSecreto'
import { esRutaDisenoIndustrial } from '../../config/disenoInicio'

/** Enlaces del menú de navegación principal. */
const enlacesNavegacion = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Sobre nosotros' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/productos', label: 'Catálogo' },
  { to: '/trabaja-con-nosotros', label: 'Trabaja con nosotros' },
  { to: '/contacto', label: 'Contacto' },
]

/**
 * Encabezado a ancho completo con logo y navegación centrada.
 */
export function Encabezado() {
  const { pathname } = useLocation()
  const { registrarClic } = useAccesoSecreto()
  const logoClaro = esRutaDisenoIndustrial(pathname)

  function manejarClicLogo(e: MouseEvent) {
    if (registrarClic()) e.preventDefault()
  }

  return (
    <header className="header">
      <div className="container header__shell">
        <div className={`header__pill${logoClaro ? ' hero-vidrio-oscuro' : ''}`}>
          <Link to="/" className="header__logo" onClick={manejarClicLogo} aria-label={configuracionSitio.name}>
            <LogoAleph variant={logoClaro ? 'claro' : 'default'} />
          </Link>

          <nav className="header__nav" aria-label="Navegación principal">
            <ul>
              {enlacesNavegacion.map((enlace) => (
                <li key={enlace.to}>
                  <NavLink to={enlace.to} end={enlace.to === '/'}>
                    {enlace.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
