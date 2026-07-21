/**
 * @file PaginaNosotros.tsx
 * @description Página institucional que presenta la historia, misión, visión, valores,
 * métricas de experiencia y certificaciones de Aleph Impresores.
 * @module paginas/PaginaNosotros
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton, TituloSeccion } from '../componentes/interfaz/Boton'
import { SeccionPagina } from '../componentes/interfaz/SeccionPagina'
import { informacionEmpresa } from '../datos/empresa'
import { certificaciones } from '../datos/contenido'

export function PaginaNosotros() {
  return (
    <>
      <MetaPagina
        title="Nosotros"
        description="Conoce la historia, misión, visión y valores de Aleph Impresores."
      />

      <SeccionPagina className="pagina-seccion--hero">
        <TituloSeccion title="Nuestra historia" />
        <p className="pagina-seccion__texto">{informacionEmpresa.history}</p>
      </SeccionPagina>

      <SeccionPagina>
        <div className="grid grid--2">
          <div className="info-card">
            <span className="info-card__acento info-card__acento--c" aria-hidden="true" />
            <h3>Misión</h3>
            <p>{informacionEmpresa.mission}</p>
          </div>
          <div className="info-card">
            <span className="info-card__acento info-card__acento--m" aria-hidden="true" />
            <h3>Visión</h3>
            <p>{informacionEmpresa.vision}</p>
          </div>
        </div>
      </SeccionPagina>

      <SeccionPagina>
        <TituloSeccion title="Nuestros valores" />
        <div className="grid grid--3">
          {informacionEmpresa.values.map((v, i) => {
            const acentos = ['c', 'm', 'y'] as const
            return (
              <div key={v.title} className="value-card">
                <span
                  className={`info-card__acento info-card__acento--${acentos[i] ?? 'k'}`}
                  aria-hidden="true"
                />
                <h3>{v.title}</h3>
                <p>{v.description}</p>
              </div>
            )
          })}
        </div>
      </SeccionPagina>

      <SeccionPagina>
        <TituloSeccion title="Experiencia" subtitle="Números que respaldan nuestro trabajo" />
        <div className="metrics-grid">
          {informacionEmpresa.experience.map((e) => (
            <div key={e.label} className="metric-card">
              <span className="metric-card__value">{e.metric}</span>
              <span className="metric-card__label">{e.label}</span>
            </div>
          ))}
        </div>
      </SeccionPagina>

      <SeccionPagina>
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
      </SeccionPagina>

      <SeccionPagina panelClassName="pagina-seccion__panel--formulario">
        <TituloSeccion title="¿Quieres ser parte del equipo?" />
        <p className="pagina-seccion__texto">
          Buscamos talento en producción, diseño, ventas y logística. Consulta nuestras vacantes
          y envía tu hoja de vida a Recursos Humanos.
        </p>
        <Boton to="/trabaja-con-nosotros" variant="gradient">
          Trabaja con nosotros →
        </Boton>
      </SeccionPagina>
    </>
  )
}
