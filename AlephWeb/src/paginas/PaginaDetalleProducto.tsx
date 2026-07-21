/**
 * @file PaginaDetalleProducto.tsx
 * @description Página de detalle de un producto individual con galería, especificaciones
 * técnicas y enlace directo a cotización. Implementa el requisito funcional RF-005.
 * @module paginas/PaginaDetalleProducto
 */

import { Link, useParams } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton } from '../componentes/interfaz/Boton'
import { useProductos } from '../hooks/useProductos'
import { categorias } from '../datos/categorias'

export function PaginaDetalleProducto() {
  const { slug } = useParams<{ slug: string }>()
  const productos = useProductos()
  const product = slug ? productos.find((p) => p.slug === slug) : undefined
  const category = product ? categorias.find((c) => c.id === product.categoryId) : undefined

  if (!product) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h1>Producto no encontrado</h1>
          <Boton to="/productos">Volver al portafolio</Boton>
        </div>
      </section>
    )
  }

  return (
    <>
      <MetaPagina title={product.name} description={product.shortDescription} />

      <section className="section">
        <div className="container">
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link> / <Link to="/productos">Productos</Link> / {product.name}
          </nav>

          <div className="product-detail">
            <div className="product-detail__gallery">
              <img src={product.image} alt={product.name} className="product-detail__main-image" />
              <div className="product-detail__thumbs">
                {product.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`${product.name} vista ${i + 1}`} loading="lazy" />
                ))}
              </div>
            </div>

            <div className="product-detail__info">
              {category && <span className="product-card__category">{category.name}</span>}
              <h1>{product.name}</h1>
              <p className="product-detail__desc">{product.description}</p>

              <div className="detail-list">
                <h3>Materiales</h3>
                <ul>
                  {product.materials.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-list">
                <h3>Acabados</h3>
                <ul>
                  {product.finishes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <div className="detail-list">
                <h3>Aplicaciones</h3>
                <ul>
                  {product.applications.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>

              <Boton to={`/cotizacion?producto=${product.slug}`}>Solicitar cotización</Boton>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
