/**
 * @file TarjetaProducto.tsx
 * @description Tarjeta visual para mostrar un producto en listados y portafolio (RF-003).
 * @module componentes/interfaz/TarjetaProducto
 */

import { Link } from 'react-router-dom'
import type { Producto } from '../../tipos/indice'
import { categorias } from '../../datos/categorias'

/** Propiedades de la tarjeta de producto. */
interface PropiedadesTarjetaProducto {
  product: Producto
}

/**
 * Renderiza una tarjeta con imagen, categoría, descripción y enlace a cotización.
 * @param props.product - Datos del producto a mostrar.
 */
export function TarjetaProducto({ product }: PropiedadesTarjetaProducto) {
  const categoria = categorias.find((c) => c.id === product.categoryId)

  return (
    <article className="product-card">
      <Link to={`/productos/${product.slug}`} className="product-card__image-link">
        <img src={product.image} alt={product.name} loading="lazy" />
        {categoria && <span className="product-card__category">{categoria.name}</span>}
      </Link>
      <div className="product-card__body">
        <h3>
          <Link to={`/productos/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.shortDescription}</p>
        <Link to={`/cotizacion?producto=${product.slug}`} className="product-card__cta">
          Solicitar cotización →
        </Link>
      </div>
    </article>
  )
}
