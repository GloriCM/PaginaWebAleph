/**
 * Pausa animaciones costosas mientras el usuario hace scroll (mejor FPS).
 */

import { useEffect } from 'react'

const CLASE_DESPLAZANDO = 'desplazando'
const RETRASO_MS = 180

export function usePausarEfectosScroll(activo = true) {
  useEffect(() => {
    if (!activo) return

    const raiz = document.documentElement
    let temporizador: ReturnType<typeof setTimeout> | undefined

    function alDesplazar() {
      if (!raiz.classList.contains(CLASE_DESPLAZANDO)) {
        raiz.classList.add(CLASE_DESPLAZANDO)
      }

      if (temporizador) clearTimeout(temporizador)
      temporizador = setTimeout(() => {
        raiz.classList.remove(CLASE_DESPLAZANDO)
      }, RETRASO_MS)
    }

    window.addEventListener('scroll', alDesplazar, { passive: true })
    window.addEventListener('wheel', alDesplazar, { passive: true })
    window.addEventListener('touchmove', alDesplazar, { passive: true })

    return () => {
      if (temporizador) clearTimeout(temporizador)
      raiz.classList.remove(CLASE_DESPLAZANDO)
      window.removeEventListener('scroll', alDesplazar)
      window.removeEventListener('wheel', alDesplazar)
      window.removeEventListener('touchmove', alDesplazar)
    }
  }, [activo])
}
