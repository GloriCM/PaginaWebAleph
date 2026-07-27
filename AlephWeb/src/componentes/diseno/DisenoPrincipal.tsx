/**

 * @file DisenoPrincipal.tsx

 * @description Layout base del sitio público: encabezado, contenido, pie y WhatsApp.

 */



import { Suspense, useEffect } from 'react'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Encabezado } from './Encabezado'

import { BotonWhatsApp } from './BotonWhatsApp'

import { FondoIndustrial } from './FondoIndustrial'

import { FondoAnimado } from './FondoAnimado'

import { RUTA_ACCESO } from '../../config/accesoAdmin'

import { esRutaDisenoIndustrial } from '../../config/disenoInicio'
import { useContenidoInicio } from '../../hooks/useContenidoInicio'
import { usePausarEfectosScroll } from '../../hooks/usePausarEfectosScroll'

import { lazyPagina } from '../../utilidades/lazyPagina'

const PiePagina = lazyPagina(() => import('./PiePagina'), 'PiePagina')



export function DisenoPrincipal() {

  const { pathname } = useLocation()

  const navigate = useNavigate()

  const disenoIndustrial = esRutaDisenoIndustrial(pathname)
  const contenidoInicio = useContenidoInicio()
  const esInicio = pathname === '/'

  usePausarEfectosScroll(disenoIndustrial)

  const mostrarPie = esInicio



  useEffect(() => {

    function atajoAcceso(e: KeyboardEvent) {

      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'g') {

        e.preventDefault()

        navigate(RUTA_ACCESO)

      }

    }



    window.addEventListener('keydown', atajoAcceso)

    return () => window.removeEventListener('keydown', atajoAcceso)

  }, [navigate])



  const clasesLayout = [

    'app-layout',

    disenoIndustrial ? 'app-layout--inicio-industrial' : '',

  ]

    .filter(Boolean)

    .join(' ')



  return (

    <div className={clasesLayout}>

      {disenoIndustrial ? (
        <FondoIndustrial
          esInicio={esInicio}
          imagenPersonalizada={contenidoInicio.hero.fondoImagen}
        />
      ) : (
        <FondoAnimado />
      )}

      <Encabezado />

      <main>

        <Outlet />

      </main>

      {mostrarPie && (
        <Suspense fallback={null}>
          <PiePagina />
        </Suspense>
      )}

      <BotonWhatsApp />

    </div>

  )

}


