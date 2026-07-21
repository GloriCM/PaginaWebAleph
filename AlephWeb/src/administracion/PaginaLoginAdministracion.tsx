/**
 * @file PaginaLoginAdministracion.tsx
 * @description Página de inicio de sesión del panel administrativo.
 */

import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { LogoAleph } from '../componentes/interfaz/LogoAleph'
import { RUTA_GESTION } from '../config/accesoAdmin'

const USUARIO_DEMO = { email: 'admin@aleph.com', password: 'admin123' }

export function PaginaLoginAdministracion() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    if (email === USUARIO_DEMO.email && password === USUARIO_DEMO.password) {
      sessionStorage.setItem('aleph_admin', 'true')
      navigate(RUTA_GESTION)
    } else {
      setError('Credenciales incorrectas. Usa admin@aleph.com / admin123')
    }
  }

  return (
    <div className="admin-login">
      <MetaPagina title="Admin - Iniciar sesión" />

      <div className="admin-login__card">
        <div className="admin-login__marca">
          <LogoAleph variant="claro" className="admin-login__logo" />
        </div>

        <header className="admin-login__header">
          <h1>Panel administrativo</h1>
          <p>Gestiona el contenido de Aleph Impresores</p>
        </header>

        <form className="admin-login__form" onSubmit={manejarEnvio}>
          {error && (
            <p className="admin-login__error" role="alert">
              {error}
            </p>
          )}

          <label className="admin-login__field">
            <span>Correo electrónico</span>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="admin@aleph.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="admin-login__field">
            <span>Contraseña</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit" className="admin-login__submit">
            Ingresar
          </button>
        </form>

        <p className="admin-login__hint">
          Demo: <strong>admin@aleph.com</strong> / <strong>admin123</strong>
        </p>

        <Link to="/" className="admin-login__volver">
          ← Volver al sitio
        </Link>
      </div>
    </div>
  )
}
