/**
 * @file principal.tsx
 * @description Punto de entrada de la aplicación React.
 * Monta el componente raíz en el elemento #root del DOM.
 * @module principal
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos-globales.css'
import Aplicacion from './Aplicacion.tsx'

/** Contenedor raíz del DOM donde se monta React. */
const contenedor = document.getElementById('root')

if (contenedor) {
  createRoot(contenedor).render(
    <StrictMode>
      <Aplicacion />
    </StrictMode>,
  )
}
