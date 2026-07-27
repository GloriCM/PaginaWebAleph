/**
 * @file PaginaInicio.tsx
 * @description Página principal — contenido editable desde el panel admin.
 */

import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton, TituloSeccion } from '../componentes/interfaz/Boton'
import { HeroInicioIndustrial } from '../componentes/inicio/HeroInicioIndustrial'
import { useContenidoInicio } from '../hooks/useContenidoInicio'
import { categorias } from '../datos/categorias'
import { obtenerMarcasInicioVisibles } from '../datos/contenidoInicio'
import { resolverUrlMapa } from '../utilidades/mapaEmbed'
import { lazyPagina } from '../utilidades/lazyPagina'
import { CarruselMarcasInicio } from '../componentes/inicio/CarruselMarcasInicio'

const MapaEmbed = lazy(() =>
  import('../componentes/interfaz/MapaEmbed').then((m) => ({ default: m.MapaEmbed })),
)

const SeccionComentarios = lazyPagina(
  () => import('../componentes/interfaz/SeccionComentarios'),
  'SeccionComentarios',
)

export function PaginaInicio() {
  const contenido = useContenidoInicio()
  const refEspecialidades = useRef<HTMLElement>(null)
  const [especialidadesAnimadas, setEspecialidadesAnimadas] = useState(false)

  useEffect(() => {
    const seccion = refEspecialidades.current
    if (!seccion) return

    if (!('IntersectionObserver' in window)) {
      setEspecialidadesAnimadas(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEspecialidadesAnimadas(true)
          observer.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(seccion)
    return () => observer.disconnect()
  }, [])
  const { seo, hero, sobreNosotros, especialidades, marcasClientes, ctaCotizacion, contacto } =
    contenido

  const categoriasDestacadas = especialidades.categoriaIds
    .map((id) => categorias.find((c) => c.id === id))
    .filter(Boolean)

  const marcasMostrar = obtenerMarcasInicioVisibles(contenido)

  return (
    <>
      <MetaPagina title={seo.titulo} description={seo.descripcion} />

      <HeroInicioIndustrial hero={hero} />

      <section className="section seccion-intro seccion-diferida">
        <div className="container">
          <div
            className={`panel-vidrio seccion-intro__panel${sobreNosotros.imagen ? ' seccion-intro__panel--con-imagen' : ''}`}
          >
            <TituloSeccion title={sobreNosotros.titulo} />
            <div className={sobreNosotros.imagen ? 'seccion-intro__grid' : undefined}>
              <div className="seccion-intro__pilares">
                <article className="pilar-empresa">
                  <span className="pilar-empresa__acento pilar-empresa__acento--c" aria-hidden="true" />
                  <h3>{sobreNosotros.misionTitulo}</h3>
                  <p>{sobreNosotros.mision}</p>
                </article>
                <article className="pilar-empresa">
                  <span className="pilar-empresa__acento pilar-empresa__acento--m" aria-hidden="true" />
                  <h3>{sobreNosotros.visionTitulo}</h3>
                  <p>{sobreNosotros.vision}</p>
                </article>
              </div>
              {sobreNosotros.imagen && (
                <img
                  src={sobreNosotros.imagen}
                  alt=""
                  className="seccion-intro__imagen"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
            <div className="seccion-intro__metricas-bar hero-vidrio-oscuro">
              <ul className="hero-industrial__metricas">
                {sobreNosotros.metricas.map((item) => (
                  <li key={item.label} className="hero-industrial__metrica">
                    <strong>{item.metric}</strong>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="seccion-intro__accion">
              <Boton to={sobreNosotros.boton.enlace} variant="gradient">
                {sobreNosotros.boton.texto}
              </Boton>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={refEspecialidades}
        className={`section seccion-especialidades seccion-diferida${especialidadesAnimadas ? ' seccion-especialidades--animada' : ''}`}
      >
        <div className="container">
          <div className="seccion-especialidades__encabezado">
            <TituloSeccion title={especialidades.titulo} />
          </div>
        </div>
        <div className="container">
          <div className="especialidades-grid">
            {categoriasDestacadas.map((cat, i) => {
              if (!cat) return null
              const imagen = especialidades.imagenes[cat.id]
              return (
                <Link
                  key={cat.id}
                  to={`/productos?categoria=${cat.id}`}
                  className="especialidad-tarjeta"
                  style={{ '--especialidad-i': i } as CSSProperties}
                >
                  <div className="especialidad-tarjeta__media">
                    {imagen ? (
                      <img
                        src={imagen}
                        alt=""
                        className="especialidad-tarjeta__imagen"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span className="especialidad-tarjeta__icono" aria-hidden="true">
                        {cat.icon}
                      </span>
                    )}
                  </div>
                  <span className="especialidad-tarjeta__nombre">{cat.name}</span>
                </Link>
              )
            })}
          </div>
          <div className="enlace-ver-todo enlace-ver-todo--especialidades">
            <Link to={especialidades.enlaceVerTodo.enlace}>{especialidades.enlaceVerTodo.texto}</Link>
          </div>
        </div>
      </section>

      <section className="section seccion-marcas seccion-diferida">
        <div className="container">
          <div className="seccion-marcas__encabezado">
            <TituloSeccion title={marcasClientes.titulo} subtitle={marcasClientes.subtitulo} />
          </div>
        </div>
        {marcasMostrar.length > 0 ? (
          <CarruselMarcasInicio marcas={marcasMostrar} />
        ) : (
          <p className="marcas-vacio container">Aún no hay marcas seleccionadas para mostrar.</p>
        )}
      </section>

      <Suspense fallback={null}>
        <SeccionComentarios />
      </Suspense>

      <section
        className={`section cta-impresion seccion-diferida${ctaCotizacion.imagenFondo ? ' cta-impresion--con-imagen' : ''}`}
        style={
          ctaCotizacion.imagenFondo
            ? { backgroundImage: `url(${ctaCotizacion.imagenFondo})` }
            : undefined
        }
      >
        <div className="container">
          <div className="panel-vidrio cta-impresion__panel">
            <h2>{ctaCotizacion.titulo}</h2>
            <p>{ctaCotizacion.parrafo}</p>
            <Boton to={ctaCotizacion.boton.enlace} variant="gradient">
              {ctaCotizacion.boton.texto}
            </Boton>
          </div>
        </div>
      </section>

      <section className="section seccion-contacto-inicio seccion-diferida">
        <div className="container">
          <div className="panel-vidrio contact-preview">
            <div className="contact-preview__info">
              <TituloSeccion title={contacto.titulo} />
              <ul className="contact-list">
                <li>
                  <strong>Dirección:</strong> {contacto.direccion}
                </li>
                <li>
                  <strong>Teléfono:</strong>{' '}
                  <a href={`tel:${contacto.telefono}`}>{contacto.telefono}</a>
                </li>
                <li>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${contacto.email}`}>{contacto.email}</a>
                </li>
              </ul>
              <div className="contact-preview__actions">
                <Boton to={contacto.boton.enlace} className="form--contacto__enviar">
                  {contacto.boton.texto}
                </Boton>
              </div>
            </div>
            <Suspense
              fallback={
                <div className="map-embed map-embed--interno map-embed__placeholder" aria-hidden="true" />
              }
            >
              <MapaEmbed title="Ubicación de Aleph Impresores" src={resolverUrlMapa(contacto.direccion, contacto.mapEmbedUrl)} />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
