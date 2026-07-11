/**
 * @file Aplicacion.tsx
 * @description Componente raíz con definición de rutas públicas y administrativas.
 * Configura React Router para todos los módulos del sitio web de Aleph Impresores.
 * @module Aplicacion
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DisenoPrincipal } from './componentes/diseno/DisenoPrincipal'
import { PaginaInicio } from './paginas/PaginaInicio'
import { PaginaNosotros } from './paginas/PaginaNosotros'
import { PaginaProductos } from './paginas/PaginaProductos'
import { PaginaDetalleProducto } from './paginas/PaginaDetalleProducto'
import { PaginaIndustrias } from './paginas/PaginaIndustrias'
import { PaginaServicios } from './paginas/PaginaServicios'
import { PaginaGaleria } from './paginas/PaginaGaleria'
import { PaginaNoticias } from './paginas/PaginaNoticias'
import { PaginaDetalleNoticia } from './paginas/PaginaDetalleNoticia'
import { PaginaClientes } from './paginas/PaginaClientes'
import { PaginaCertificaciones } from './paginas/PaginaCertificaciones'
import { PaginaContacto } from './paginas/PaginaContacto'
import { PaginaCotizacion } from './paginas/PaginaCotizacion'
import { DisenoAdministracion, RutaInvitadoAdmin } from './administracion/DisenoAdministracion'
import { PaginaLoginAdministracion } from './administracion/PaginaLoginAdministracion'
import { PaginaPanelAdministracion } from './administracion/PaginaPanelAdministracion'
import { PaginaGestionProductos } from './administracion/PaginaGestionProductos'
import { PaginaGestionImagenes } from './administracion/PaginaGestionImagenes'
import { PaginaSolicitudes } from './administracion/PaginaSolicitudes'
import { PaginaGestionUsuarios } from './administracion/PaginaGestionUsuarios'

/**
 * Aplicación principal con enrutamiento del sitio público y panel administrativo.
 * @returns Árbol de rutas de React Router.
 */
export default function Aplicacion() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas del sitio público con layout compartido */}
        <Route element={<DisenoPrincipal />}>
          <Route index element={<PaginaInicio />} />
          <Route path="nosotros" element={<PaginaNosotros />} />
          <Route path="productos" element={<PaginaProductos />} />
          <Route path="productos/:slug" element={<PaginaDetalleProducto />} />
          <Route path="industrias" element={<PaginaIndustrias />} />
          <Route path="servicios" element={<PaginaServicios />} />
          <Route path="galeria" element={<PaginaGaleria />} />
          <Route path="noticias" element={<PaginaNoticias />} />
          <Route path="noticias/:slug" element={<PaginaDetalleNoticia />} />
          <Route path="clientes" element={<PaginaClientes />} />
          <Route path="certificaciones" element={<PaginaCertificaciones />} />
          <Route path="contacto" element={<PaginaContacto />} />
          <Route path="cotizacion" element={<PaginaCotizacion />} />
        </Route>

        {/* Login del panel administrativo (sin layout público) */}
        <Route
          path="admin/login"
          element={
            <RutaInvitadoAdmin>
              <PaginaLoginAdministracion />
            </RutaInvitadoAdmin>
          }
        />

        {/* Rutas protegidas del panel administrativo */}
        <Route path="admin" element={<DisenoAdministracion />}>
          <Route index element={<PaginaPanelAdministracion />} />
          <Route path="productos" element={<PaginaGestionProductos />} />
          <Route path="imagenes" element={<PaginaGestionImagenes />} />
          <Route path="leads" element={<PaginaSolicitudes />} />
          <Route path="usuarios" element={<PaginaGestionUsuarios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
