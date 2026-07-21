/**

 * @file Aplicacion.tsx

 * @description Componente raíz con definición de rutas públicas y administrativas.

 * Configura React Router para todos los módulos del sitio web de Aleph Impresores.

 * @module Aplicacion

 */



import { Suspense } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { DisenoPrincipal } from './componentes/diseno/DisenoPrincipal'

import { PaginaInicio } from './paginas/PaginaInicio'

import { CargandoPagina } from './componentes/interfaz/CargandoPagina'

import { RutaInvitadoAdmin } from './administracion/DisenoAdministracion'

import { lazyPagina } from './utilidades/lazyPagina'

import { RUTA_ACCESO, RUTA_GESTION } from './config/accesoAdmin'



const PaginaNosotros = lazyPagina(() => import('./paginas/PaginaNosotros'), 'PaginaNosotros')

const PaginaProductos = lazyPagina(() => import('./paginas/PaginaProductos'), 'PaginaProductos')

const PaginaDetalleProducto = lazyPagina(() => import('./paginas/PaginaDetalleProducto'), 'PaginaDetalleProducto')

const PaginaIndustrias = lazyPagina(() => import('./paginas/PaginaIndustrias'), 'PaginaIndustrias')

const PaginaServicios = lazyPagina(() => import('./paginas/PaginaServicios'), 'PaginaServicios')

const PaginaGaleria = lazyPagina(() => import('./paginas/PaginaGaleria'), 'PaginaGaleria')

const PaginaNoticias = lazyPagina(() => import('./paginas/PaginaNoticias'), 'PaginaNoticias')

const PaginaDetalleNoticia = lazyPagina(() => import('./paginas/PaginaDetalleNoticia'), 'PaginaDetalleNoticia')

const PaginaClientes = lazyPagina(() => import('./paginas/PaginaClientes'), 'PaginaClientes')

const PaginaCertificaciones = lazyPagina(() => import('./paginas/PaginaCertificaciones'), 'PaginaCertificaciones')

const PaginaContacto = lazyPagina(() => import('./paginas/PaginaContacto'), 'PaginaContacto')

const PaginaCotizacion = lazyPagina(() => import('./paginas/PaginaCotizacion'), 'PaginaCotizacion')

const PaginaTrabajaConNosotros = lazyPagina(
  () => import('./paginas/PaginaTrabajaConNosotros'),
  'PaginaTrabajaConNosotros',
)



const PaginaLoginAdministracion = lazyPagina(

  () => import('./administracion/PaginaLoginAdministracion'),

  'PaginaLoginAdministracion',

)

const DisenoAdministracion = lazyPagina(

  () => import('./administracion/DisenoAdministracion'),

  'DisenoAdministracion',

)

const PaginaPanelAdministracion = lazyPagina(

  () => import('./administracion/PaginaPanelAdministracion'),

  'PaginaPanelAdministracion',

)

const PaginaGestionProductos = lazyPagina(

  () => import('./administracion/PaginaGestionProductos'),

  'PaginaGestionProductos',

)

const PaginaGestionImagenes = lazyPagina(

  () => import('./administracion/PaginaGestionImagenes'),

  'PaginaGestionImagenes',

)

const PaginaGestionVacantes = lazyPagina(
  () => import('./administracion/PaginaGestionVacantes'),
  'PaginaGestionVacantes',
)

const PaginaGestionInicio = lazyPagina(
  () => import('./administracion/PaginaGestionInicio'),
  'PaginaGestionInicio',
)

const PaginaSolicitudes = lazyPagina(() => import('./administracion/PaginaSolicitudes'), 'PaginaSolicitudes')

const PaginaGestionUsuarios = lazyPagina(

  () => import('./administracion/PaginaGestionUsuarios'),

  'PaginaGestionUsuarios',

)



/**

 * Aplicación principal con enrutamiento del sitio público y panel administrativo.

 * @returns Árbol de rutas de React Router.

 */

export default function Aplicacion() {

  return (

    <BrowserRouter>

      <Suspense fallback={<CargandoPagina />}>

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

            <Route path="trabaja-con-nosotros" element={<PaginaTrabajaConNosotros />} />

          </Route>



          {/* Login oculto del panel (sin layout público) */}

          <Route

            path={RUTA_ACCESO}

            element={

              <RutaInvitadoAdmin>

                <PaginaLoginAdministracion />

              </RutaInvitadoAdmin>

            }

          />



          {/* Rutas protegidas del panel administrativo */}

          <Route path={RUTA_GESTION} element={<DisenoAdministracion />}>

            <Route index element={<PaginaPanelAdministracion />} />

            <Route path="inicio" element={<PaginaGestionInicio />} />

            <Route path="productos" element={<PaginaGestionProductos />} />

            <Route path="imagenes" element={<PaginaGestionImagenes />} />

            <Route path="vacantes" element={<PaginaGestionVacantes />} />

            <Route path="leads" element={<PaginaSolicitudes />} />

            <Route path="usuarios" element={<PaginaGestionUsuarios />} />

          </Route>



          {/* Rutas /admin visibles redirigen al inicio (sin revelar el panel) */}

          <Route path="admin/*" element={<Navigate to="/" replace />} />

        </Routes>

      </Suspense>

    </BrowserRouter>

  )

}

