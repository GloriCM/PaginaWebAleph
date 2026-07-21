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

import { lazyPagina } from '../../utilidades/lazyPagina'

const PiePagina = lazyPagina(() => import('./PiePagina'), 'PiePagina')



export function DisenoPrincipal() {

  const { pathname } = useLocation()

  const navigate = useNavigate()

  const disenoIndustrial = esRutaDisenoIndustrial(pathname)
  const contenidoInicio = useContenidoInicio()
  const esInicio = pathname === '/'

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

    disenoIndustrial && !esInicio ? 'app-layout--inicio-industrial-interno' : '',

  ]

    .filter(Boolean)

    .join(' ')



  return (

    <div className={clasesLayout}>

      {disenoIndustrial ? (
        <FondoIndustrial
          esInicio={esInicio}
          imagenPersonalizada={esInicio ? contenidoInicio.hero.fondoImagen : null}
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


