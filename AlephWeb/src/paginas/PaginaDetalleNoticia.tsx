/**
 * @file PaginaDetalleNoticia.tsx
 * @description Página de detalle de una noticia individual identificada por slug en la URL.
 * Muestra título, fecha, imagen destacada y contenido completo del artículo.
 * @module paginas/PaginaDetalleNoticia
 */

import { Link, useParams } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { obtenerNoticiaPorSlug } from '../datos/contenido'
import { Boton } from '../componentes/interfaz/Boton'

/**
 * Renderiza el artículo completo de una noticia o un estado vacío si no se encuentra.
 * @returns Elemento JSX con el contenido de la noticia o mensaje de error.
 */
export function PaginaDetalleNoticia() {
  const { slug } = useParams<{ slug: string }>()
  const article = slug ? obtenerNoticiaPorSlug(slug) : undefined

  if (!article) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h1>Noticia no encontrada</h1>
          <Boton to="/noticias">Volver a noticias</Boton>
        </div>
      </section>
    )
  }

  return (
    <>
      <MetaPagina title={article.title} description={article.excerpt} />

      <article className="section">
        <div className="container article">
          <nav className="breadcrumb">
            <Link to="/">Inicio</Link> / <Link to="/noticias">Noticias</Link> / {article.title}
          </nav>
          <time dateTime={article.date}>
            {new Date(article.date).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <h1>{article.title}</h1>
          <img src={article.image} alt={article.title} className="article__image" />
          <div className="article__content">
            <p>{article.content}</p>
          </div>
        </div>
      </article>
    </>
  )
}
