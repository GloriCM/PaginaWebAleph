/**
 * Hero industrial — textos y métricas editables desde el panel admin.
 */

import { Boton } from '../interfaz/Boton'
import type { ContenidoInicio } from '../../datos/contenidoInicio'

interface PropiedadesHeroInicioIndustrial {
  hero: ContenidoInicio['hero']
}

export function HeroInicioIndustrial({ hero }: PropiedadesHeroInicioIndustrial) {
  return (
    <section className="hero-industrial" aria-label="Presentación Aleph Impresores">
      <div className="hero-industrial__spot" aria-hidden="true" />

      <div className="container hero-industrial__contenido">
        <div className="hero-industrial__principal">
          <div className="hero-industrial__grupo">
            <div className="hero-vidrio-oscuro hero-industrial__panel">
              <h1 className="hero-industrial__titulo">
                <span className="hero-industrial__reveal hero-industrial__reveal--1">
                  {hero.linea1}
                </span>
                <span className="hero-industrial__reveal hero-industrial__reveal--2">
                  <em>{hero.linea2}</em>
                </span>
              </h1>

              <p className="hero-industrial__texto hero-industrial__reveal hero-industrial__reveal--3">
                {hero.parrafo}
              </p>

              <div className="hero-industrial__acciones hero-industrial__reveal hero-industrial__reveal--4">
                <Boton to={hero.botonPortafolio.enlace} variant="gradient" className="hero-industrial__btn-ancho">
                  {hero.botonPortafolio.texto}
                </Boton>
                <div className="hero-industrial__acciones-fila">
                  <Boton to={hero.botonCotizar.enlace} variant="outline">
                    {hero.botonCotizar.texto}
                  </Boton>
                  <Boton to={hero.botonTrabaja.enlace} variant="outline">
                    {hero.botonTrabaja.texto}
                  </Boton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
