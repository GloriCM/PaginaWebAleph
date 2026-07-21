import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CLICS_ACCESO, RUTA_ACCESO, VENTANA_CLICS_MS } from '../config/accesoAdmin'

/**
 * Cuenta clics rápidos y navega al login oculto del panel al alcanzar el umbral.
 * @returns Función que registra un clic; devuelve true si se activó el acceso (evitar navegación del enlace).
 */
export function useAccesoSecreto() {
  const navigate = useNavigate()
  const clics = useRef(0)
  const ultimoClic = useRef(0)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  const registrarClic = useCallback(() => {
    const ahora = Date.now()

    if (ahora - ultimoClic.current > VENTANA_CLICS_MS) {
      clics.current = 0
    }

    clics.current += 1
    ultimoClic.current = ahora

    if (temporizador.current) clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => {
      clics.current = 0
    }, VENTANA_CLICS_MS)

    if (clics.current >= CLICS_ACCESO) {
      clics.current = 0
      if (temporizador.current) clearTimeout(temporizador.current)
      navigate(RUTA_ACCESO)
      return true
    }

    return false
  }, [navigate])

  return { registrarClic }
}
