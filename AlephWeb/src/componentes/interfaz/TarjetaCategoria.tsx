/**
 * @file TarjetaCategoria.tsx
 * @description Tarjeta de acceso rápido a una categoría de productos (RF-004).
 * @module componentes/interfaz/TarjetaCategoria
 */

import { Link } from 'react-router-dom'
import type { Categoria } from '../../tipos/indice'

/** Propiedades de la tarjeta de categoría. */
interface PropiedadesTarjetaCategoria {
  category: Categoria
}

/**
 * Enlace visual hacia el listado de productos filtrado por categoría.
 * @param props.category - Datos de la categoría a mostrar.
 */
export function TarjetaCategoria({ category }: PropiedadesTarjetaCategoria) {
  return (
    <Link to={`/productos?categoria=${category.id}`} className="category-card">
      <span className="category-card__icon" aria-hidden="true">
        {category.icon}
      </span>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
    </Link>
  )
}
