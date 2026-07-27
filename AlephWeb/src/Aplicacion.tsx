/**
 * @file Aplicacion.tsx
 * @description Componente raíz con definición de rutas públicas y administrativas.
 * Configura React Router para todos los módulos del sitio web de Aleph Impresores.
 * @module Aplicacion
 */

import { Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
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
const PaginaGestionContenido = lazyPagina(
  () => import('./administracion/PaginaGestionContenido'),
  'PaginaGestionContenido',
)
const PaginaSolicitudes = lazyPagina(() => import('./administracion/PaginaSolicitudes'), 'PaginaSolicitudes')
const PaginaGestionUsuarios = lazyPagina(
  () => import('./administracion/PaginaGestionUsuarios'),
  'PaginaGestionUsuarios',
)

const router = createBrowserRouter([
  {
    element: <DisenoPrincipal />,
    children: [
      { index: true, element: <PaginaInicio /> },
      { path: 'nosotros', element: <PaginaNosotros /> },
      { path: 'productos', element: <PaginaProductos /> },
      { path: 'productos/:slug', element: <PaginaDetalleProducto /> },
      { path: 'industrias', element: <PaginaIndustrias /> },
      { path: 'servicios', element: <PaginaServicios /> },
      { path: 'galeria', element: <PaginaGaleria /> },
      { path: 'noticias', element: <PaginaNoticias /> },
      { path: 'noticias/:slug', element: <PaginaDetalleNoticia /> },
      { path: 'clientes', element: <PaginaClientes /> },
      { path: 'certificaciones', element: <PaginaCertificaciones /> },
      { path: 'contacto', element: <PaginaContacto /> },
      { path: 'cotizacion', element: <PaginaCotizacion /> },
      { path: 'trabaja-con-nosotros', element: <PaginaTrabajaConNosotros /> },
    ],
  },
  {
    path: RUTA_ACCESO,
    element: (
      <RutaInvitadoAdmin>
        <PaginaLoginAdministracion />
      </RutaInvitadoAdmin>
    ),
  },
  {
    path: RUTA_GESTION,
    element: <DisenoAdministracion />,
    children: [
      { index: true, element: <PaginaPanelAdministracion /> },
      { path: 'inicio', element: <PaginaGestionInicio /> },
      { path: 'contenido', element: <PaginaGestionContenido /> },
      { path: 'productos', element: <PaginaGestionProductos /> },
      { path: 'imagenes', element: <PaginaGestionImagenes /> },
      { path: 'vacantes', element: <PaginaGestionVacantes /> },
      { path: 'leads', element: <PaginaSolicitudes /> },
      { path: 'usuarios', element: <PaginaGestionUsuarios /> },
    ],
  },
  { path: 'admin/*', element: <Navigate to="/" replace /> },
])

/**
 * Aplicación principal con enrutamiento del sitio público y panel administrativo.
 * @returns Árbol de rutas de React Router.
 */
export default function Aplicacion() {
  return (
    <Suspense fallback={<CargandoPagina />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
