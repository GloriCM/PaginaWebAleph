/**
 * Hook para leer contenido de inicio y reaccionar a cambios del admin.
 */

import { useEffect, useState } from 'react'
import {
  EVENTO_CONTENIDO_INICIO,
  obtenerContenidoInicio,
  type ContenidoInicio,
} from '../datos/contenidoInicio'

export function useContenidoInicio(): ContenidoInicio {
  const [contenido, setContenido] = useState<ContenidoInicio>(() => obtenerContenidoInicio())

  useEffect(() => {
    function actualizar() {
      setContenido(obtenerContenidoInicio())
    }

    window.addEventListener(EVENTO_CONTENIDO_INICIO, actualizar)
    return () => window.removeEventListener(EVENTO_CONTENIDO_INICIO, actualizar)
  }, [])

  return contenido
}
