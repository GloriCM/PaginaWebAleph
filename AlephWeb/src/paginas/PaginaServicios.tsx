/**
 * @file PaginaServicios.tsx
 * @description Página que describe los servicios ofrecidos por Aleph Impresores,
 * desde diseño gráfico hasta impresión, acabados especiales y logística.
 * @module paginas/PaginaServicios
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion } from '../componentes/interfaz/Boton'
import { servicios } from '../datos/empresa'

/**
 * Renderiza el catálogo de servicios con numeración secuencial y descripción de cada uno.
 * @returns Elemento JSX con el listado de servicios de la empresa.
 */
export function PaginaServicios() {
  return (
    <>
      <MetaPagina
        title="Servicios"
        description="Diseño gráfico, impresión offset y digital, acabados especiales y logística."
      />

      <section className="page-hero">
        <div className="container">
          <h1>Servicios</h1>
          <p>Acompañamos tu proyecto desde el diseño hasta la entrega final.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <TituloSeccion title="Nuestros servicios" />
          <div className="grid grid--3">
            {servicios.map((service, i) => (
              <article key={service.name} className="service-card">
                <span className="service-card__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
