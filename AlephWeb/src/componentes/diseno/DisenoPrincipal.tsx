/**
 * @file DisenoPrincipal.tsx
 * @description Layout base del sitio público: encabezado, contenido, pie y WhatsApp.
 * Utiliza React Router Outlet para renderizar las páginas hijas.
 * @module componentes/diseno/DisenoPrincipal
 */

import { Outlet, useLocation } from 'react-router-dom'
import { Encabezado } from './Encabezado'
import { PiePagina } from './PiePagina'
import { BotonWhatsApp } from './BotonWhatsApp'
import { FondoAnimado } from './FondoAnimado'

/**
 * Estructura HTML principal compartida por todas las páginas públicas.
 * El pie de página solo se muestra en la interfaz de inicio.
 */
export function DisenoPrincipal() {
  const { pathname } = useLocation()
  const esInicio = pathname === '/'

  return (
    <div className="app-layout">
      <FondoAnimado />
      <Encabezado />
      <main>
        <Outlet />
      </main>
      {esInicio && <PiePagina />}
      <BotonWhatsApp />
    </div>
  )
}
