/**
 * @file Encabezado.tsx
 * @description Barra de navegación principal del sitio (RNF-002).
 * Cápsula flotante con enlaces siempre visibles en la barra.
 * @module componentes/diseno/Encabezado
 */

import { Link, NavLink } from 'react-router-dom'
import logo from '../../activos/logo.png'
import { configuracionSitio } from '../../datos/configuracionSitio'

/** Enlaces del menú de navegación principal. */
const enlacesNavegacion = [
  { to: '/', label: 'Inicio' },
  { to: '/nosotros', label: 'Sobre nosotros' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/productos', label: 'Catálogo' },
  { to: '/contacto', label: 'Contacto' },
]

/**
 * Encabezado a ancho completo con logo y navegación centrada.
 */
export function Encabezado() {
  return (
    <header className="header">
      <div className="container header__shell">
        <div className="header__pill">
          <Link to="/" className="header__logo">
            <img src={logo} alt={configuracionSitio.name} />
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
