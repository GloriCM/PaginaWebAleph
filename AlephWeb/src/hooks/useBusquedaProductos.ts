/**
 * @file useBusquedaProductos.ts
 * @description Hook personalizado para búsqueda y filtrado de productos (RF-018).
 * Permite filtrar por texto y por categoría de forma reactiva.
 * @module hooks/useBusquedaProductos
 */

import { useMemo, useState } from 'react'
import { categorias } from '../datos/categorias'
import { useProductos } from './useProductos'

/**
 * Hook que gestiona el estado de búsqueda de productos.
 * @param categoriaInicial - ID de categoría preseleccionada (desde URL).
 * @returns Estado y funciones para consulta y filtrado.
 */
export function useBusquedaProductos(categoriaInicial = '') {
  const productos = useProductos()
  const [consulta, setConsulta] = useState('')
  const [categoria, setCategoria] = useState(categoriaInicial)

  /** Productos filtrados según consulta y categoría activa. */
  const resultados = useMemo(() => {
    const texto = consulta.trim().toLowerCase()
    return productos.filter((producto) => {
      const coincideCategoria = !categoria || producto.categoryId === categoria
      const coincideTexto =
        !texto ||
        producto.name.toLowerCase().includes(texto) ||
        producto.shortDescription.toLowerCase().includes(texto) ||
        categorias
          .find((c) => c.id === producto.categoryId)
          ?.name.toLowerCase()
          .includes(texto)
      return coincideCategoria && coincideTexto
    })
  }, [consulta, categoria, productos])

  return {
    consulta,
    setConsulta,
    categoria,
    setCategoria,
    resultados,
  }
}
