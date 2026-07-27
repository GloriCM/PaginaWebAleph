/**
 * @file PaginaCertificaciones.tsx
 * @description Página dedicada a las certificaciones de calidad y sostenibilidad
 * obtenidas por Aleph Impresores, con emisor, año y descripción de cada una.
 * Implementa el requisito funcional RF-011 (certificaciones).
 * @module paginas/PaginaCertificaciones
 */

import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion } from '../componentes/interfaz/Boton'
import { useContenidoEditorial } from '../hooks/useContenidoEditorial'

/**
 * Renderiza el listado ampliado de certificaciones con imagen y detalles del emisor.
 * @returns Elemento JSX con las certificaciones de la empresa.
 */
export function PaginaCertificaciones() {
  const { certificaciones } = useContenidoEditorial()
  return (
    <>
      <MetaPagina
        title="Certificaciones"
        description="Certificaciones de calidad y sostenibilidad de Aleph Impresores."
      />

      <section className="page-hero">
        <div className="container">
          <h1>Certificaciones</h1>
          <p>Compromiso con estándares internacionales de calidad.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <TituloSeccion title="Nuestras certificaciones" />
          <div className="grid grid--3">
            {certificaciones.map((cert) => (
              <article key={cert.id} className="cert-card cert-card--large">
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
