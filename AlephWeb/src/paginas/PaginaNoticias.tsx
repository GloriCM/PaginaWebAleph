/**
 * @file PaginaNoticias.tsx
 * @description Página de listado de noticias y novedades corporativas de Aleph Impresores.
 * Muestra tarjetas con imagen, fecha, extracto y enlace al detalle de cada publicación.
 * Implementa el requisito funcional RF-010 (sección de noticias).
 * @module paginas/PaginaNoticias
 */

import { Link } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { useContenidoEditorial } from '../hooks/useContenidoEditorial'

/**
 * Renderiza el listado de noticias ordenadas en tarjetas con enlace al artículo completo.
 * @returns Elemento JSX con la cuadrícula de noticias publicadas.
 */
export function PaginaNoticias() {
  const { noticias } = useContenidoEditorial()
  return (
    <>
      <MetaPagina title="Noticias" description="Novedades y actualizaciones de Aleph Impresores." />

      <section className="page-hero">
        <div className="container">
          <h1>Noticias</h1>
          <p>Mantente al día con las últimas novedades de la empresa.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid--3">
            {noticias.map((item) => (
              <article key={item.id} className="news-card">
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="news-card__body">
                  <time dateTime={item.date}>
                    {new Date(item.date).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h3>
                    <Link to={`/noticias/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p>{item.excerpt}</p>
                  <Link to={`/noticias/${item.slug}`} className="news-card__link">
                    Leer más →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
