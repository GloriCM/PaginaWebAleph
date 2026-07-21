/**
 * @file PaginaServicios.tsx
 * @description Página que describe los servicios ofrecidos por Aleph Impresores.
 * @module paginas/PaginaServicios
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion } from '../componentes/interfaz/Boton'
import { SeccionPagina } from '../componentes/interfaz/SeccionPagina'
import { servicios } from '../datos/empresa'

export function PaginaServicios() {
  return (
    <>
      <MetaPagina
        title="Servicios"
        description="Diseño gráfico, impresión offset y digital, acabados especiales y logística."
      />

      <SeccionPagina className="pagina-seccion--hero">
        <h1 className="pagina-seccion__titulo">Servicios</h1>
        <p className="pagina-seccion__texto">
          Acompañamos tu proyecto desde el diseño hasta la entrega final.
        </p>
      </SeccionPagina>

      <SeccionPagina>
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
      </SeccionPagina>
    </>
  )
}
