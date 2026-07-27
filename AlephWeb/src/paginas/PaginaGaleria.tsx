/**
 * @file PaginaGaleria.tsx
 * @description Galería de proyectos con diseño editorial y efectos CMYK al estilo del inicio.
 * Implementa RF-009 con tarjetas glassmorphism y hero visual.
 * @module paginas/PaginaGaleria
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton, TituloSeccion } from '../componentes/interfaz/Boton'
import { useContenidoEditorial } from '../hooks/useContenidoEditorial'

/**
 * Página de galería con hero editorial, grid de portafolio y CTA de cotización.
 */
export function PaginaGaleria() {
  const { galeria: proyectosGaleria } = useContenidoEditorial()
  const proyectosHero = proyectosGaleria.slice(0, 3)
  return (
    <div className="pagina-galeria">
      <MetaPagina
        title="Galería de proyectos"
        description="Trabajos realizados por Aleph Impresores para marcas líderes."
      />

      <section className="hero-editorial hero-galeria">
        <div className="container hero-editorial__grid">
          <div className="hero-editorial__texto">
            <p className="etiqueta-seccion">Portafolio</p>
            <h1>
              Galería de <em>proyectos</em>
            </h1>
            <p>
              Trabajos donde la precisión técnica y el diseño se encuentran. Cada pieza
              refleja nuestro dominio del color y la calidad de impresión.
            </p>
            <Boton to="/cotizacion" variant="gradient">
              Solicitar cotización →
            </Boton>
          </div>

          <div className="hero-editorial__visual hero-galeria__visual">
            <div className="hero-galeria__mosaico" aria-hidden="true">
              {proyectosHero.map((proyecto, i) => (
                <div
                  key={proyecto.id}
                  className={`hero-galeria__pieza hero-galeria__pieza--${i + 1}`}
                >
                  <img src={proyecto.image} alt="" loading="eager" />
                </div>
              ))}
            </div>
            <div className="hero-editorial__cita hero-galeria__cita">
              <span className="hero-editorial__cita-etiqueta">Maestría CMYK</span>
              <p>"Cada proyecto es una traducción de visión en experiencia táctil."</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--suave">
        <div className="container">
          <TituloSeccion
            title="Proyectos destacados"
            subtitle="Cada pieza refleja nuestro compromiso con la calidad de impresión"
          />
          <div className="galeria-portafolio">
            {proyectosGaleria.map((proyecto) => (
              <article key={proyecto.id} className="tarjeta-portafolio">
                <div className="tarjeta-portafolio__imagen">
                  <img src={proyecto.image} alt={proyecto.name} loading="lazy" />
                  <span className="tarjeta-portafolio__etiqueta">{proyecto.productType}</span>
                </div>
                <div className="tarjeta-portafolio__cuerpo">
                  <h3>{proyecto.name}</h3>
                  {proyecto.client && (
                    <p className="tarjeta-portafolio__cliente">{proyecto.client}</p>
                  )}
                  <p className="tarjeta-portafolio__desc">{proyecto.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-impresion">
        <div className="container cta-impresion__inner">
          <h2>¿Tiene una visión única?</h2>
          <p>
            Colaboremos en su próxima obra maestra. Desde materiales personalizados hasta
            acabados especiales, aportamos precisión a su pasión.
          </p>
          <Boton to="/cotizacion" variant="gradient">Comience una consulta</Boton>
        </div>
      </section>
    </div>
  )
}
