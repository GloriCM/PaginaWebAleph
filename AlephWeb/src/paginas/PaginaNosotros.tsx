/**
 * @file PaginaNosotros.tsx
 * @description Página institucional — contenido editable desde el panel admin.
 * @module paginas/PaginaNosotros
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion } from '../componentes/interfaz/Boton'
import { SeccionPagina } from '../componentes/interfaz/SeccionPagina'
import { useContenidoInicio } from '../hooks/useContenidoInicio'
import { useContenidoEditorial } from '../hooks/useContenidoEditorial'

export function PaginaNosotros() {
  const { sobreNosotros } = useContenidoInicio()
  const { certificaciones, paginaNosotros } = useContenidoEditorial()

  return (
    <>
      <MetaPagina
        title="Nosotros"
        description="Conoce la historia, misión, visión y valores de Aleph Impresores."
      />

      <SeccionPagina className="pagina-seccion--hero">
        <TituloSeccion title={sobreNosotros.historiaTitulo} />
        <p className="pagina-seccion__texto">{sobreNosotros.historia}</p>
      </SeccionPagina>

      <SeccionPagina>
        <div className={sobreNosotros.imagen ? 'seccion-intro__grid' : undefined}>
          <div className="grid grid--2">
            <div className="info-card">
              <span className="info-card__acento info-card__acento--c" aria-hidden="true" />
              <h3>{sobreNosotros.misionTitulo}</h3>
              <p>{sobreNosotros.mision}</p>
            </div>
            <div className="info-card">
              <span className="info-card__acento info-card__acento--m" aria-hidden="true" />
              <h3>{sobreNosotros.visionTitulo}</h3>
              <p>{sobreNosotros.vision}</p>
            </div>
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
      </SeccionPagina>

      <SeccionPagina>
        <TituloSeccion title={sobreNosotros.valoresTitulo} />
        <div className="grid grid--3">
          {sobreNosotros.valores.map((v, i) => {
            const acentos = ['c', 'm', 'y'] as const
            return (
              <div key={`${v.title}-${i}`} className="value-card">
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
        <TituloSeccion
          title={sobreNosotros.experienciaTitulo}
          subtitle={sobreNosotros.experienciaSubtitulo}
        />
        <div className="metrics-grid">
          {sobreNosotros.metricas.map((e) => (
            <div key={e.label} className="metric-card">
              <span className="metric-card__value">{e.metric}</span>
              <span className="metric-card__label">{e.label}</span>
            </div>
          ))}
        </div>
      </SeccionPagina>

      <SeccionPagina>
        <TituloSeccion
          title={paginaNosotros.certificacionesTitulo}
          subtitle={paginaNosotros.certificacionesSubtitulo}
        />
        <div className="grid grid--3">
          {certificaciones.map((cert) => (
            <article key={cert.id} className="cert-card">
              <img src={cert.image} alt={cert.name} loading="lazy" />
              <h3>{cert.name}</h3>
              <p className="cert-card__issuer">
                {cert.issuer} · {cert.year}
              </p>
              <p>{cert.description}</p>
            </article>
          ))}
        </div>
      </SeccionPagina>
    </>
  )
}
