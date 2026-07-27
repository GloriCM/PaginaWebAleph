/**
 * @file PaginaServicios.tsx
 * @description Página de servicios — contenido editable desde el panel admin.
 * @module paginas/PaginaServicios
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton, TituloSeccion } from '../componentes/interfaz/Boton'
import { useContenidoEditorial } from '../hooks/useContenidoEditorial'

const ACENTOS = ['c', 'm', 'y', 'k'] as const

function iconoServicio(nombre: string): string {
  const clave = nombre.toLowerCase()
  if (clave.includes('gráfico') || clave.includes('grafico')) return '🎨'
  if (clave.includes('estructural')) return '📐'
  if (clave.includes('offset')) return '🖨️'
  if (clave.includes('digital')) return '⚡'
  if (clave.includes('acabado')) return '✨'
  if (clave.includes('logística') || clave.includes('logistica') || clave.includes('distribución')) return '🚚'
  return '✦'
}

export function PaginaServicios() {
  const { servicios, paginaServicios } = useContenidoEditorial()
  const { hero, proceso, listado, cta } = paginaServicios

  return (
    <div className="pagina-servicios">
      <MetaPagina title="Servicios" description={paginaServicios.seoDescripcion} />

      <section className="hero-editorial hero-servicios">
        <div className="container hero-editorial__grid">
          <div className="hero-editorial__texto hero-servicios__texto panel-vidrio">
            <p className="etiqueta-seccion">{hero.etiqueta}</p>
            <h1>
              {hero.tituloAntes}
              <em>{hero.tituloDestacado}</em>
              {hero.tituloDespues}
            </h1>
            <p>{hero.parrafo}</p>
            <div className="hero-servicios__acciones">
              <Boton to={hero.botonPrincipal.enlace} variant="gradient">
                {hero.botonPrincipal.texto}
              </Boton>
              <Boton to={hero.botonSecundario.enlace} variant="ghost">
                {hero.botonSecundario.texto}
              </Boton>
            </div>
          </div>

          <div className="hero-editorial__visual hero-servicios__visual" aria-hidden="true">
            <div className="hero-servicios__orbe hero-servicios__orbe--c" />
            <div className="hero-servicios__orbe hero-servicios__orbe--m" />
            <div className="hero-servicios__orbe hero-servicios__orbe--y" />
            <div className="hero-servicios__orbe hero-servicios__orbe--k" />
            <div className="hero-servicios__panel">
              <span className="hero-servicios__panel-etiqueta">{hero.panelEtiqueta}</span>
              <p>{hero.panelTexto}</p>
              <div className="hero-servicios__cmyk">
                <span /><span /><span /><span />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--suave">
        <div className="container">
          <TituloSeccion title={proceso.titulo} subtitle={proceso.subtitulo} />
          <div className="servicios-proceso">
            {proceso.pasos.map((paso, i) => (
              <article key={paso.id} className="servicios-proceso__paso">
                <span
                  className={`servicios-proceso__linea servicios-proceso__linea--${ACENTOS[i % ACENTOS.length]}`}
                  aria-hidden="true"
                />
                <span className="servicios-proceso__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section seccion-servicios">
        <div className="container">
          <div className="seccion-servicios__encabezado">
            <TituloSeccion title={listado.titulo} subtitle={listado.subtitulo} />
          </div>
          <div className="servicios-grid">
            {servicios.map((service, i) => {
              const acento = ACENTOS[i % ACENTOS.length]
              return (
                <article
                  key={service.id}
                  className={`servicio-tarjeta servicio-tarjeta--${acento}`}
                >
                  <div className="servicio-tarjeta__cabecera">
                    <span className="servicio-tarjeta__icono" aria-hidden="true">
                      {iconoServicio(service.name)}
                    </span>
                    <span className="servicio-tarjeta__num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <span className={`servicio-tarjeta__barra servicio-tarjeta__barra--${acento}`} aria-hidden="true" />
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="cta-impresion">
        <div className="container">
          <div className="panel-vidrio cta-impresion__panel">
            <h2>{cta.titulo}</h2>
            <p>{cta.texto}</p>
            <div className="hero-servicios__acciones hero-servicios__acciones--centro">
              <Boton to={cta.botonPrincipal.enlace} variant="gradient">
                {cta.botonPrincipal.texto}
              </Boton>
              <Boton to={cta.botonSecundario.enlace} variant="ghost">
                {cta.botonSecundario.texto}
              </Boton>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
