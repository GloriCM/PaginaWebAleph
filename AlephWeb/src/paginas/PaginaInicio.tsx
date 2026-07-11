/**
 * @file PaginaInicio.tsx
 * @description Página principal con diseño glassmorphism inspirado en los mockups de Aleph.
 * Implementa RF-001: banner, resumen, categorías circulares, productos y contacto.
 * @module paginas/PaginaInicio
 */

import { Link } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton, TituloSeccion } from '../componentes/interfaz/Boton'
import { SeccionComentarios } from '../componentes/interfaz/SeccionComentarios'
import { informacionEmpresa } from '../datos/empresa'
import { categorias } from '../datos/categorias'
import { productos } from '../datos/productos'
import { configuracionSitio } from '../datos/configuracionSitio'
import imagenHero from '../activos/prensa-heidelberg.png'

/** Tres categorías destacadas para la sección de círculos fluidos. */
const categoriasDestacadas = categorias.filter((c) =>
  ['plegadizas', 'bolsas', 'exhibidores'].includes(c.id),
)

/**
 * Página de inicio con hero editorial, especialidades circulares y llamados a la acción.
 */
export function PaginaInicio() {
  return (
    <>
      <MetaPagina title={configuracionSitio.seo.defaultTitle} description={configuracionSitio.seo.defaultDescription} />

      {/* Hero principal — banner RF-001 */}
      <section className="hero-editorial">
        <div className="container hero-editorial__grid">
          <div className="hero-editorial__texto">
            <h1>
              Dominando el <em>Arte del Color</em>
            </h1>
            <p>
              Somos una empresa colombiana especializada en artes gráficas, desarrollo de 
              empaques.Combinamos tecnología de punta con un equipo creativo
              para entregar productos que destacan. 
              Donde la fluidez creativa se encuentra con la
              precisión técnica. No solo imprimimos; traducimos tu visión en experiencias táctiles
              sobre superficies premium.
            </p>
            <Boton to="/galeria" variant="gradient">
              Nuestro portafolio →
            </Boton>
          </div>

          <div className="hero-editorial__visual">
            <div className="hero-editorial__forma">
              <img src={imagenHero} alt="Prensa offset Heidelberg Speedmaster en Aleph Impresores" />
            </div>
          </div>
        </div>
      </section>

      {/* About — misión, visión y enlace a /nosotros */}
      <section className="section seccion-intro">
        <div className="container">
          <div className="panel-vidrio seccion-intro__panel">
            <TituloSeccion title="Sobre nosotros" />
            <div className="seccion-intro__pilares">
              <article className="pilar-empresa">
                <span className="pilar-empresa__acento pilar-empresa__acento--c" aria-hidden="true" />
                <h3>Misión</h3>
                <p>{informacionEmpresa.mission}</p>
              </article>
              <article className="pilar-empresa">
                <span className="pilar-empresa__acento pilar-empresa__acento--m" aria-hidden="true" />
                <h3>Visión</h3>
                <p>{informacionEmpresa.vision}</p>
              </article>
            </div>
            <div className="seccion-intro__accion">
              <Boton to="/nosotros" variant="gradient">
                Conocemos mas →
              </Boton>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades — estilo subrayado CMYK */}
      <section className="section seccion-especialidades">
        <div className="container">
          <div className="panel-vidrio seccion-especialidades__panel">
            <TituloSeccion title="Nuestras especialidades" />
            <div className="especialidades-subrayado">
              {categoriasDestacadas.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/productos?categoria=${cat.id}`}
                  className={`especialidad-subrayado especialidad-subrayado--${i + 1}`}
                >
                  <span className="especialidad-subrayado__icono" aria-hidden="true">{cat.icon}</span>
                  <strong>{cat.name}</strong>
                </Link>
              ))}
            </div>
            <div className="enlace-ver-todo">
              <Link to="/productos">Ver todas las categorías →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Productos destacados — estilo overlay */}
      <section className="section seccion-productos-destacados">
        <div className="container">
          <div className="panel-vidrio seccion-productos-destacados__panel">
            <TituloSeccion title="Productos destacados" subtitle="Conoce algunas de nuestras soluciones" />
            <div className="productos-overlay">
              {productos.slice(0, 3).map((product, i) => {
                const categoria = categorias.find((c) => c.id === product.categoryId)
                return (
                  <Link
                    key={product.id}
                    to={`/productos/${product.slug}`}
                    className={`producto-overlay producto-overlay--${i + 1}`}
                  >
                    <span className="producto-overlay__fondo" aria-hidden="true">
                      {categoria?.icon ?? '✦'}
                    </span>
                    <span className="producto-overlay__contenido">
                      {categoria && <span className="producto-overlay__cat">{categoria.name}</span>}
                      <strong>{product.name}</strong>
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios y comentarios de clientes — RF-013 */}
      <SeccionComentarios />

      {/* CTA cotización */}
      <section className="section cta-impresion">
        <div className="container">
          <div className="panel-vidrio cta-impresion__panel">
            <h2>¿Listo para imprimir tu próxima obra maestra?</h2>
            <p>Cuéntanos tu proyecto y recibe una propuesta personalizada.</p>
            <Boton to="/cotizacion" variant="gradient">Solicitar cotización</Boton>
          </div>
        </div>
      </section>

      {/* Contacto y mapa — RF-001, RF-014 */}
      <section className="section seccion-contacto-inicio">
        <div className="container">
          <div className="panel-vidrio contact-preview">
            <div className="contact-preview__info">
              <TituloSeccion title="Contáctanos" align="left" />
              <ul className="contact-list">
                <li><strong>Dirección:</strong> {configuracionSitio.address}</li>
                <li><strong>Teléfono:</strong> <a href={`tel:${configuracionSitio.phone}`}>{configuracionSitio.phone}</a></li>
                <li><strong>Email:</strong> <a href={`mailto:${configuracionSitio.email}`}>{configuracionSitio.email}</a></li>
              </ul>
              <div className="contact-preview__actions">
                <Boton to="/contacto" className="form--contacto__enviar">¿Quieres enviar un mensaje?</Boton>
              </div>
            </div>
            <div className="map-embed map-embed--interno">
              <iframe
                title="Ubicación de Aleph Impresores"
                src={configuracionSitio.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
