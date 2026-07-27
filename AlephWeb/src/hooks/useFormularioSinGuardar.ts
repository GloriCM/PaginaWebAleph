/**
 * Avisa al salir del formulario si hay cambios sin guardar (navegación o cierre de pestaña).
 */

import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

const MENSAJE_DEFECTO =
  'Tienes cambios sin guardar. Si sales ahora, se perderán las imágenes y el texto que editaste.'

export function useFormularioSinGuardar(hayCambios: boolean, mensaje = MENSAJE_DEFECTO) {
  useEffect(() => {
    if (!hayCambios) return

    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [hayCambios])

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hayCambios && currentLocation.pathname !== nextLocation.pathname,
  )

  useEffect(() => {
    if (blocker.state !== 'blocked') return

    const salir = window.confirm(`${mensaje}\n\n¿Salir sin guardar?`)
    if (salir) blocker.proceed()
    else blocker.reset()
  }, [blocker, mensaje])

  function confirmarSiHayCambios(): boolean {
    if (!hayCambios) return true
    return window.confirm(`${mensaje}\n\n¿Continuar sin guardar?`)
  }

  return { confirmarSiHayCambios }
}

/** Serializa un valor para comparar si el formulario cambió. */
export function snapshotFormulario<T>(valor: T): string {
  return JSON.stringify(valor)
}
