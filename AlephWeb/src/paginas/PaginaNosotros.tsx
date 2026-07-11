/**
 * @file PaginaNosotros.tsx
 * @description Página institucional que presenta la historia, misión, visión, valores,
 * métricas de experiencia y certificaciones de Aleph Impresores.
 * Implementa el requisito funcional RF-002 (página nosotros).
 * @module paginas/PaginaNosotros
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion } from '../componentes/interfaz/Boton'
import { informacionEmpresa } from '../datos/empresa'
import { certificaciones } from '../datos/contenido'

/**
 * Renderiza la página corporativa "Nosotros" con la información institucional de la empresa.
 * @returns Elemento JSX con el contenido de la sección nosotros.
 */
export function PaginaNosotros() {
  return (
    <>
      <MetaPagina
        title="Nosotros"
        description="Conoce la historia, misión, visión y valores de Aleph Impresores."
      />

      <section className="section">
        <div className="container content-block">
          <TituloSeccion title="Nuestra historia" align="left" />
          <p>{informacionEmpresa.history}</p>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--2">
            <div className="info-card">
              <h3>Misión</h3>
              <p>{informacionEmpresa.mission}</p>
            </div>
            <div className="info-card">
              <h3>Visión</h3>
              <p>{informacionEmpresa.vision}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <TituloSeccion title="Nuestros valores" />
          <div className="grid grid--3">
            {informacionEmpresa.values.map((v) => (
              <div key={v.title} className="value-card">
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <TituloSeccion title="Experiencia" subtitle="Números que respaldan nuestro trabajo" />
          <div className="metrics-grid">
            {informacionEmpresa.experience.map((e) => (
              <div key={e.label} className="metric-card">
                <span className="metric-card__value">{e.metric}</span>
                <span className="metric-card__label">{e.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <TituloSeccion title="Certificaciones" subtitle="Compromiso con la calidad" />
          <div className="grid grid--3">
            {certificaciones.map((cert) => (
              <article key={cert.id} className="cert-card">
                <img src={cert.image} alt={cert.name} loading="lazy" />
                <h3>{cert.name}</h3>
                <p className="cert-card__issuer">{cert.issuer} · {cert.year}</p>
                <p>{cert.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
