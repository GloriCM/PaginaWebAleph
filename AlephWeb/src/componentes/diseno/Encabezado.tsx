/**
 * @file Encabezado.tsx
 * @description Barra de navegación principal del sitio (RNF-002).
 * En escritorio: enlaces en barra. En móvil: menú hamburguesa desplegable.
 * @module componentes/diseno/Encabezado
 */

import { useEffect, useState } from 'react'
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
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    setMenuAbierto(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuAbierto])

  function manejarClicLogo(e: MouseEvent) {
    if (registrarClic()) e.preventDefault()
  }

  function alternarMenu() {
    setMenuAbierto((prev) => !prev)
  }

  function cerrarMenu() {
    setMenuAbierto(false)
  }

  return (
    <header className="header">
      <div className="container header__shell">
        <div className={`header__pill${logoClaro ? ' hero-vidrio-oscuro' : ''}`}>
          <Link to="/" className="header__logo" onClick={manejarClicLogo} aria-label={configuracionSitio.name}>
            <LogoAleph variant={logoClaro ? 'claro' : 'default'} />
          </Link>

          <button
            type="button"
            className={`header__menu-btn${menuAbierto ? ' header__menu-btn--abierto' : ''}`}
            aria-expanded={menuAbierto}
            aria-controls="nav-principal"
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={alternarMenu}
          >
            <span className="header__menu-line" aria-hidden="true" />
            <span className="header__menu-line" aria-hidden="true" />
            <span className="header__menu-line" aria-hidden="true" />
          </button>

          <nav
            id="nav-principal"
            className={`header__nav${menuAbierto ? ' header__nav--abierto' : ''}`}
            aria-label="Navegación principal"
          >
            <ul>
              {enlacesNavegacion.map((enlace) => (
                <li key={enlace.to}>
                  <NavLink to={enlace.to} end={enlace.to === '/'} onClick={cerrarMenu}>
                    {enlace.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <button
        type="button"
        className={`header__backdrop${menuAbierto ? ' header__backdrop--visible' : ''}`}
        aria-hidden={!menuAbierto}
        tabIndex={menuAbierto ? 0 : -1}
        aria-label="Cerrar menú"
        onClick={cerrarMenu}
      />
    </header>
  )
}
