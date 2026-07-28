/**
 * @file PaginaDetalleProducto.tsx
 * @description Página de detalle de un producto individual con galería, especificaciones
 * técnicas y enlace directo a cotización. Implementa el requisito funcional RF-005.
 * @module paginas/PaginaDetalleProducto
 */

import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton } from '../componentes/interfaz/Boton'
import { useProductos } from '../hooks/useProductos'
import { categorias } from '../datos/categorias'
import { cargarProductoPorSlug, imagenesProducto } from '../datos/catalogoProductos'

export function PaginaDetalleProducto() {
  const { slug } = useParams<{ slug: string }>()
  const productos = useProductos()
  const product = slug ? productos.find((p) => p.slug === slug) : undefined
  const [cargandoDetalle, setCargandoDetalle] = useState(false)
  const category = product ? categorias.find((c) => c.id === product.categoryId) : undefined

  const imagenes = useMemo(
    () => (product ? imagenesProducto(product.image, product.gallery) : []),
    [product],
  )

  const [indiceImagen, setIndiceImagen] = useState(0)

  useEffect(() => {
    setIndiceImagen(0)
  }, [product?.id])

  useEffect(() => {
    if (!slug) return
    let activo = true
    setCargandoDetalle(true)
    void cargarProductoPorSlug(slug).finally(() => {
      if (activo) setCargandoDetalle(false)
    })
    return () => {
      activo = false
    }
  }, [slug])

  const indiceSeguro = Math.min(indiceImagen, Math.max(imagenes.length - 1, 0))
  const imagenActiva = imagenes[indiceSeguro] ?? product?.image ?? ''

  if (!product) {
    return (
      <section className="section">
        <div className="container empty-state">
          <h1>{cargandoDetalle ? 'Cargando producto…' : 'Producto no encontrado'}</h1>
          {!cargandoDetalle && <Boton to="/productos">Volver al portafolio</Boton>}
        </div>
      </section>
    )
  }

  return (
    <>
      <MetaPagina title={product.name} description={product.shortDescription} />

      <section className="section pagina-detalle-producto">
        <div className="container">
          <nav className="breadcrumb" aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link> / <Link to="/productos">Productos</Link> / {product.name}
          </nav>

          <div className="product-detail">
            <div className="product-detail__gallery">
              <div className="product-detail__image-wrap">
                <img
                  src={imagenActiva}
                  alt={product.name}
                  className="product-detail__main-image"
                />
              </div>
              {imagenes.length > 1 && (
                <div className="product-detail__thumbs" role="list" aria-label="Galería del producto">
                  {imagenes.map((img, i) => (
                    <button
                      key={`${i}-${img.slice(0, 24)}`}
                      type="button"
                      className={`product-detail__thumb-wrap${i === indiceSeguro ? ' product-detail__thumb-wrap--activo' : ''}`}
                      onClick={() => setIndiceImagen(i)}
                      aria-label={`Ver imagen ${i + 1}`}
                      aria-pressed={i === indiceSeguro}
                    >
                      <img src={img} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="product-detail__info panel-vidrio product-detail__info-panel">
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
