/**
 * @file principal.tsx
 * @description Punto de entrada de la aplicación React.
 * Monta el componente raíz en el elemento #root del DOM.
 * @module principal
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './estilos-globales.css'
import './estilos/hero-industrial.css'
import Aplicacion from './Aplicacion.tsx'
import { inicializarContenidoEditable } from './datos/inicializarContenidoEditable'

/** Contenedor raíz del DOM donde se monta React. */
const contenedor = document.getElementById('root')

if (contenedor) {
  createRoot(contenedor).render(
    <StrictMode>
      <Aplicacion />
    </StrictMode>,
  )
  void inicializarContenidoEditable()
}
