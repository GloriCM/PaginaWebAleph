/**
 * Carga el iframe de Google Maps solo cuando entra en pantalla.
 */

import { useEffect, useRef, useState } from 'react'

interface PropiedadesMapaEmbed {
  title: string
  src: string
  className?: string
}

export function MapaEmbed({ title, src, className = 'map-embed map-embed--interno' }: PropiedadesMapaEmbed) {
  const contenedorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nodo = contenedorRef.current
    if (!nodo) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(nodo)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={contenedorRef} className={className}>
      {visible ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map-embed__placeholder" aria-hidden="true" />
      )}
    </div>
  )
}
