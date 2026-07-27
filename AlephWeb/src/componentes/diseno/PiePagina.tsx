/**

 * @file PiePagina.tsx

 * @description Pie de página con marca, contacto y acciones rápidas (RF-015).

 * @module componentes/diseno/PiePagina

 */



import { Link, useLocation } from 'react-router-dom'

import type { MouseEvent } from 'react'

import { LogoAleph } from '../interfaz/LogoAleph'

import { configuracionSitio } from '../../datos/configuracionSitio'
import { obtenerContactoPublico } from '../../datos/contactoPublico'
import { useContenidoInicio } from '../../hooks/useContenidoInicio'
import { useContenidoEditorial } from '../../hooks/useContenidoEditorial'

import { useAccesoSecreto } from '../../hooks/useAccesoSecreto'

import { esRutaDisenoIndustrial } from '../../config/disenoInicio'





/**

 * Footer del sitio: marca, datos de contacto y accesos rápidos.

 */

export function PiePagina() {

  const { pathname } = useLocation()
  useContenidoInicio()
  const { sitio } = useContenidoEditorial()
  const contacto = obtenerContactoPublico()
  const tagline = sitio.tagline || configuracionSitio.tagline
  const horarios = sitio.horarios.length > 0 ? sitio.horarios : configuracionSitio.horarios

  const industrial = esRutaDisenoIndustrial(pathname)

  const { registrarClic } = useAccesoSecreto()



  function manejarClicCopyright(e: MouseEvent) {

    if (registrarClic()) e.preventDefault()

  }



  return (

    <footer className={`footer${industrial ? ' footer--industrial panel-vidrio' : ''}`}>

      <div className={industrial ? 'footer__wrap' : 'container footer__wrap'}>

        <div className="footer__envoltorio">

          <div className={`footer__inner${industrial ? ' container' : ''}`}>

            <div className="footer__brand">

              <LogoAleph variant={industrial ? 'claro' : 'default'} className="footer__logo" />

              <p>{tagline}</p>

            </div>



            <div className="footer__columnas">

              <div className="footer__bloque">

                <h4>Contacto</h4>

                <ul className="footer__contact">

                  <li>{contacto.direccion}</li>

                  <li>

                    <a href={`tel:${contacto.telefono}`}>{contacto.telefono}</a>

                  </li>

                  <li>

                    <a href={`mailto:${contacto.email}`}>{contacto.email}</a>

                  </li>

                </ul>

              </div>



              <div className="footer__bloque">

                <h4>Horarios</h4>

                <ul className="footer__contact">

                  {horarios.map((horario) => (

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

                    <Link to="/trabaja-con-nosotros">Trabaja con nosotros</Link>

                  </li>

                  <li>

                    <Link to="/certificaciones">Ver certificaciones</Link>

                  </li>

                </ul>

              </div>

            </div>

          </div>



          <div className="footer__bottom">

            <div className={industrial ? 'container' : undefined}>

              <p>

                <button

                  type="button"

                  className="footer__acceso-secreto"

                  onClick={manejarClicCopyright}

                  aria-label="Copyright"

                >

                  ©

                </button>

                {' '}

                {new Date().getFullYear()} {configuracionSitio.name}. Todos los derechos reservados.

              </p>

            </div>

          </div>

        </div>

      </div>

    </footer>

  )

}

