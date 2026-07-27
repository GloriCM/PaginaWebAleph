/**
 * Hook para leer contenido editorial y reaccionar a cambios del admin.
 */

import { useEffect, useState } from 'react'
import {
  EVENTO_CONTENIDO_EDITORIAL,
  obtenerContenidoEditorial,
  type ContenidoEditorial,
} from '../datos/contenidoEditorial'

export function useContenidoEditorial(): ContenidoEditorial {
  const [contenido, setContenido] = useState<ContenidoEditorial>(() => obtenerContenidoEditorial())

  useEffect(() => {
    function actualizar() {
      setContenido(obtenerContenidoEditorial())
    }

    window.addEventListener(EVENTO_CONTENIDO_EDITORIAL, actualizar)
    return () => window.removeEventListener(EVENTO_CONTENIDO_EDITORIAL, actualizar)
  }, [])

  return contenido
}
