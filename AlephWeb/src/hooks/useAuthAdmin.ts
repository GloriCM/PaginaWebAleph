/**
 * Valida sesión JWT del panel admin contra la API.
 */

import { useEffect, useState } from 'react'
import {
  cerrarSesionAdmin,
  haySesionAdmin,
  verificarApiDisponible,
  verificarSesionAdmin,
} from '../servicios/api'

export function useAuthAdmin() {
  const [validando, setValidando] = useState(true)
  const [autenticado, setAutenticado] = useState(false)
  const [apiDisponible, setApiDisponible] = useState(false)

  useEffect(() => {
    let activo = true

    async function validar() {
      // Sesión antigua del modo demo sin token JWT
      if (sessionStorage.getItem('aleph_admin') === 'true' && !haySesionAdmin()) {
        sessionStorage.removeItem('aleph_admin')
      }

      const salud = await verificarApiDisponible()
      if (!activo) return
      setApiDisponible(salud)

      if (!haySesionAdmin()) {
        setAutenticado(false)
        setValidando(false)
        return
      }

      const usuario = await verificarSesionAdmin()
      if (!activo) return

      setAutenticado(Boolean(usuario))
      setValidando(false)
    }

    void validar()
    return () => {
      activo = false
    }
  }, [])

  function cerrarSesion() {
    cerrarSesionAdmin()
    setAutenticado(false)
  }

  return { validando, autenticado, apiDisponible, cerrarSesion }
}
