/**
 * @file TarjetaProducto.tsx
 * @description Tarjeta visual para mostrar un producto en listados y portafolio (RF-003).
 * @module componentes/interfaz/TarjetaProducto
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Producto } from '../../tipos/indice'
import { categorias } from '../../datos/categorias'
import { imagenesProducto } from '../../datos/catalogoProductos'

/** Propiedades de la tarjeta de producto. */
interface PropiedadesTarjetaProducto {
  product: Producto
}

const INTERVALO_CARRUSEL_MS = 950

/**
 * Renderiza una tarjeta con imagen, categoría, descripción y enlace al detalle.
 * Si hay varias imágenes, al pasar el mouse hace un carrusel suave.
 */
export function TarjetaProducto({ product }: PropiedadesTarjetaProducto) {
  const categoria = categorias.find((c) => c.id === product.categoryId)
  const descripcion =
    product.shortDescription.trim() || product.description.trim()

  const imagenes = useMemo(
    () => imagenesProducto(product.image, product.gallery),
    [product.image, product.gallery],
  )
  const tieneGaleria = imagenes.length > 1

  const [indiceImagen, setIndiceImagen] = useState(0)
  const [hoverActivo, setHoverActivo] = useState(false)
  const intervaloRef = useRef<number | null>(null)

  function detenerCarrusel() {
    if (intervaloRef.current !== null) {
      window.clearInterval(intervaloRef.current)
      intervaloRef.current = null
    }
  }

  function iniciarCarrusel() {
    if (!tieneGaleria) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    detenerCarrusel()
    intervaloRef.current = window.setInterval(() => {
      setIndiceImagen((prev) => (prev + 1) % imagenes.length)
    }, INTERVALO_CARRUSEL_MS)
  }

  function manejarMouseEnter() {
    if (!tieneGaleria) return
    setHoverActivo(true)
    iniciarCarrusel()
  }

  function manejarMouseLeave() {
    setHoverActivo(false)
    detenerCarrusel()
    setIndiceImagen(0)
  }

  useEffect(() => () => detenerCarrusel(), [])

  return (
    <article className={`product-card${tieneGaleria ? ' product-card--galeria' : ''}`}>
      <Link
        to={`/productos/${product.slug}`}
        className="product-card__image-link"
        onMouseEnter={manejarMouseEnter}
        onMouseLeave={manejarMouseLeave}
        aria-label={tieneGaleria ? `${product.name} — pasar el mouse para ver más fotos` : product.name}
      >
        <div className="product-card__image-wrap">
          <div className="product-card__image-stack">
            {imagenes.map((img, i) => (
              <img
                key={`${product.id}-${i}-${img.slice(0, 20)}`}
                src={img}
                alt={i === 0 ? product.name : `${product.name} — vista ${i + 1}`}
                loading={i === 0 ? 'lazy' : 'eager'}
                className={i === indiceImagen ? 'product-card__image--activa' : undefined}
              />
            ))}
          </div>
          {tieneGaleria && (
            <>
              <span className="product-card__galeria-badge" aria-hidden="true">
                {imagenes.length} fotos
              </span>
              <div className="product-card__indicadores" aria-hidden="true">
                {imagenes.map((_, i) => (
                  <span
                    key={i}
                    className={`product-card__indicador${i === indiceImagen ? ' product-card__indicador--activo' : ''}${hoverActivo ? ' product-card__indicador--hover' : ''}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {categoria && <span className="product-card__category">{categoria.name}</span>}
      </Link>
      <div className="product-card__body">
        <h3>
          <Link to={`/productos/${product.slug}`}>{product.name}</Link>
        </h3>
        {descripcion && <p className="product-card__desc">{descripcion}</p>}
        <Link to={`/productos/${product.slug}`} className="product-card__cta">
          Ver más →
        </Link>
      </div>
    </article>
  )
}
