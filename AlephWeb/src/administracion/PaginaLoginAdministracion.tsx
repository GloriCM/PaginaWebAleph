/**
 * @file PaginaLoginAdministracion.tsx
 * @description Página de inicio de sesión del panel administrativo.
 * Valida credenciales demo y persiste la sesión en sessionStorage (RF-019).
 * @module administracion/PaginaLoginAdministracion
 */

import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton } from '../componentes/interfaz/Boton'

/** Credenciales de demostración para acceso al panel. */
const USUARIO_DEMO = { email: 'admin@aleph.com', password: 'admin123' }

/**
 * Formulario de autenticación del panel administrativo.
 * Tras un login exitoso, redirige al dashboard en `/admin`.
 */
export function PaginaLoginAdministracion() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  /**
   * Procesa el envío del formulario de login.
   * @param e - Evento de envío del formulario.
   */
  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    if (email === USUARIO_DEMO.email && password === USUARIO_DEMO.password) {
      sessionStorage.setItem('aleph_admin', 'true')
      navigate('/admin')
    } else {
      setError('Credenciales incorrectas. Usa admin@aleph.com / admin123')
    }
  }

  return (
    <div className="admin-login">
      <MetaPagina title="Admin - Iniciar sesión" />
      <form className="admin-login__form" onSubmit={manejarEnvio}>
        <h1>Panel administrativo</h1>
        <p>Aleph Impresores</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <label>
          Correo
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Contraseña
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <Boton type="submit">Ingresar</Boton>
        <p className="admin-login__hint">Demo: admin@aleph.com / admin123</p>
      </form>
    </div>
  )
}
