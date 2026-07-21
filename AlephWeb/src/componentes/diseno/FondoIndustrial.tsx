/**
 * Fondo fijo de la prensa con efecto Ken Burns (compartido entre páginas industriales).
 */

import { useEffect } from 'react'
import imagenHero768 from '../../activos/prensa-heidelberg-768.webp'
import imagenHero1280 from '../../activos/prensa-heidelberg-1280.webp'
import imagenHero from '../../activos/prensa-heidelberg.webp'
import imagenHeroFallback from '../../activos/prensa-heidelberg.png'

interface PropiedadesFondoIndustrial {
  /** En inicio: animación Ken Burns e imagen de mayor resolución. */
  esInicio?: boolean
  /** Imagen personalizada desde admin (reemplaza la prensa por defecto). */
  imagenPersonalizada?: string | null
}

export function FondoIndustrial({ esInicio = false, imagenPersonalizada = null }: PropiedadesFondoIndustrial) {
  useEffect(() => {
    if (!esInicio || imagenPersonalizada) return

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
  }, [esInicio, imagenPersonalizada])

  if (imagenPersonalizada) {
    return (
      <div className="hero-industrial__fondo hero-industrial__fondo--layout" aria-hidden="true">
        <div
          className={`hero-industrial__ken-burns${esInicio ? ' hero-industrial__ken-burns--inicio' : ' hero-industrial__ken-burns--estatico'}`}
        >
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

  if (!esInicio) {
    return (
      <div className="hero-industrial__fondo hero-industrial__fondo--layout" aria-hidden="true">
        <div className="hero-industrial__ken-burns hero-industrial__ken-burns--estatico">
          <img
            className="hero-industrial__imagen"
            src={imagenHero768}
            alt=""
            decoding="async"
            loading="lazy"
            fetchPriority="low"
            width={768}
            height={432}
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
      <div className="hero-industrial__ken-burns hero-industrial__ken-burns--inicio">
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
            fetchPriority="high"
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
