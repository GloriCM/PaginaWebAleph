/**
 * Fondo fijo de la prensa con efecto Ken Burns (compartido entre todas las páginas públicas).
 */

import { useEffect } from 'react'
import imagenHero768 from '../../activos/prensa-heidelberg-768.webp'
import imagenHero1280 from '../../activos/prensa-heidelberg-1280.webp'
import imagenHero from '../../activos/prensa-heidelberg.webp'
import imagenHeroFallback from '../../activos/prensa-heidelberg.png'

interface PropiedadesFondoIndustrial {
  /** En inicio: prioridad alta de carga de imagen. */
  esInicio?: boolean
  /** Imagen personalizada desde admin (reemplaza la prensa por defecto). */
  imagenPersonalizada?: string | null
}

const CLASE_KEN_BURNS = 'hero-industrial__ken-burns hero-industrial__ken-burns--inicio'

export function FondoIndustrial({ esInicio = false, imagenPersonalizada = null }: PropiedadesFondoIndustrial) {
  useEffect(() => {
    if (imagenPersonalizada) return

    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    preload.type = 'image/webp'
    preload.imageSizes = '100vw'
    preload.imageSrcset = `${imagenHero768} 768w, ${imagenHero1280} 1280w, ${imagenHero} 1920w`
    preload.href = imagenHero768
    document.head.appendChild(preload)

    return () => {
      preload.remove()
    }
  }, [imagenPersonalizada])

  if (imagenPersonalizada) {
    return (
      <div className="hero-industrial__fondo hero-industrial__fondo--layout" aria-hidden="true">
        <div className={CLASE_KEN_BURNS}>
          <img
            className="hero-industrial__imagen"
            src={imagenPersonalizada}
            alt=""
            decoding="async"
            fetchPriority={esInicio ? 'high' : 'low'}
            loading={esInicio ? 'eager' : 'lazy'}
          />
        </div>
        <div className="hero-industrial__overlay" />
        <div className="hero-industrial__fade-out" />
        <div className="hero-industrial__vignette" />
      </div>
    )
  }

  return (
    <div className="hero-industrial__fondo hero-industrial__fondo--layout" aria-hidden="true">
      <div className={CLASE_KEN_BURNS}>
        <picture>
          <source
            type="image/webp"
            srcSet={`${imagenHero768} 768w, ${imagenHero1280} 1280w, ${imagenHero} 1920w`}
            sizes="100vw"
          />
          <img
            className="hero-industrial__imagen"
            src={imagenHeroFallback}
            alt=""
            decoding="async"
            fetchPriority={esInicio ? 'high' : 'low'}
            loading={esInicio ? 'eager' : 'lazy'}
            width={1920}
            height={1080}
          />
        </picture>
      </div>
      <div className="hero-industrial__overlay" />
      <div className="hero-industrial__fade-out" />
      <div className="hero-industrial__vignette" />
    </div>
  )
}
