/**
 * Hook reactivo del catálogo de productos.
 */

import { useEffect, useState } from 'react'
import { EVENTO_CATALOGO_PRODUCTOS, obtenerProductos } from '../datos/catalogoProductos'
import type { Producto } from '../tipos/indice'

export function useProductos(): Producto[] {
  const [productos, setProductos] = useState<Producto[]>(() => obtenerProductos())

  useEffect(() => {
    function actualizar() {
      setProductos(obtenerProductos())
    }

    window.addEventListener(EVENTO_CATALOGO_PRODUCTOS, actualizar)
    return () => window.removeEventListener(EVENTO_CATALOGO_PRODUCTOS, actualizar)
  }, [])

  return productos
}
