/**
 * @file PiePagina.tsx
 * @description Pie de página con marca, contacto y acciones rápidas (RF-015).
 * @module componentes/diseno/PiePagina
 */

import { Link } from 'react-router-dom'
import logo from '../../activos/logo.png'
import { configuracionSitio } from '../../datos/configuracionSitio'

/**
 * Footer del sitio: marca, datos de contacto y accesos rápidos.
 * Visible en la página de inicio.
 */
export function PiePagina() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img src={logo} alt={configuracionSitio.name} className="footer__logo" />
          <p>{configuracionSitio.tagline}</p>
        </div>

        <div className="footer__columnas">
          <div className="footer__bloque">
            <h4>Contacto</h4>
            <ul className="footer__contact">
              <li>{configuracionSitio.address}</li>
              <li>
                <a href={`tel:${configuracionSitio.phone}`}>{configuracionSitio.phone}</a>
              </li>
              <li>
                <a href={`mailto:${configuracionSitio.email}`}>{configuracionSitio.email}</a>
              </li>
            </ul>
          </div>

          <div className="footer__bloque">
            <h4>Horarios</h4>
            <ul className="footer__contact">
              {configuracionSitio.horarios.map((horario) => (
                <li key={horario}>{horario}</li>
              ))}
            </ul>
          </div>

          <div className="footer__bloque">
            <h4>Acciones rápidas</h4>
            <ul className="footer__links">
              <li>
                <Link to="/cotizacion">Solicitar cotización</Link>
              </li>
              <li>
                <Link to="/contacto">Formulario de contacto</Link>
              </li>
              <li>
                <Link to="/certificaciones">Ver certificaciones</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} {configuracionSitio.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
