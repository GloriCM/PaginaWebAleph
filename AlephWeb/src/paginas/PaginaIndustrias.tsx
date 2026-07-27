/**
 * @file PaginaIndustrias.tsx
 * @description Página que presenta los sectores industriales atendidos por Aleph Impresores,
 * con descripción de las soluciones gráficas adaptadas a cada rubro.
 * @module paginas/PaginaIndustrias
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { useContenidoEditorial } from '../hooks/useContenidoEditorial'

/**
 * Renderiza la cuadrícula de industrias con icono, nombre y descripción de cada sector.
 * @returns Elemento JSX con el listado de industrias atendidas.
 */
export function PaginaIndustrias() {
  const { industrias } = useContenidoEditorial()
  return (
    <>
      <MetaPagina
        title="Industrias"
        description="Sectores que atendemos: alimentos, farmacéutico, cosmética, retail y más."
      />

      <section className="page-hero">
        <div className="container">
          <h1>Industrias que atendemos</h1>
          <p>Soluciones gráficas adaptadas a las necesidades de cada sector.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            {industrias.map((ind) => (
              <article key={ind.id} className="industry-card">
                <span className="industry-card__icon" aria-hidden="true">{ind.icon}</span>
                <h3>{ind.name}</h3>
                <p>{ind.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
