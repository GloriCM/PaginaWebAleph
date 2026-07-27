/**
 * @file PaginaGestionVacantes.tsx
 * @description Panel para que RRHH publique el banner de vacantes disponibles.
 */

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { AlertaCambiosSinGuardar } from './componentes/AlertaCambiosSinGuardar'
import { configuracionSitio } from '../datos/configuracionSitio'
import { snapshotFormulario, useFormularioSinGuardar } from '../hooks/useFormularioSinGuardar'
import {
  archivoABase64,
  cargarBannerVacantes,
  guardarBannerVacantes,
  obtenerBannerVacantes,
  type BannerVacantesRRHH,
} from '../datos/vacantesRRHH'

export function PaginaGestionVacantes() {
  const lineaBaseRef = useRef('')
  const emailRRHH = configuracionSitio.emailRRHH
  const [banner, setBanner] = useState<BannerVacantesRRHH>(() => obtenerBannerVacantes())
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const hayCambios = useMemo(() => {
    if (cargando) return false
    return snapshotFormulario({ ...banner, updatedAt: null }) !== lineaBaseRef.current
  }, [banner, cargando])

  useFormularioSinGuardar(hayCambios)

  useEffect(() => {
    let activo = true
    setCargando(true)
    cargarBannerVacantes().then((datos) => {
      if (activo) {
        setBanner(datos)
        lineaBaseRef.current = snapshotFormulario({ ...datos, updatedAt: null })
        setCargando(false)
      }
    })
    return () => {
      activo = false
    }
  }, [])

  async function manejarImagen(e: ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    if (!archivo.type.startsWith('image/')) {
      setMensaje('Selecciona un archivo de imagen (JPG, PNG o WebP).')
      return
    }

    const imageDataUrl = await archivoABase64(archivo)
    setBanner((prev) => ({ ...prev, imageDataUrl }))
    setMensaje('')
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')
    try {
      const guardado = await guardarBannerVacantes(banner)
      setBanner(guardado)
      lineaBaseRef.current = snapshotFormulario({ ...guardado, updatedAt: null })
      setMensaje('Banner publicado. Revisa la página «Trabaja con nosotros».')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo guardar el banner.')
    } finally {
      setGuardando(false)
    }
  }

  function quitarImagen() {
    setBanner((prev) => ({ ...prev, imageDataUrl: null }))
  }

  return (
    <>
      <MetaPagina title="Admin - Vacantes RRHH" />
      <h1>Vacantes — Recursos Humanos</h1>
      <p className="admin-subtitle">
        Sube la imagen de vacantes disponibles. Los candidatos la verán en{' '}
        <a href="/trabaja-con-nosotros" target="_blank" rel="noreferrer">
          Trabaja con nosotros
        </a>
        .
      </p>

      <div className="admin-vacantes-grid">
        <form className="admin-vacantes-form" onSubmit={manejarEnvio}>
          <AlertaCambiosSinGuardar visible={hayCambios} etiquetaGuardar="Publicar banner" />
          <section className="admin-section">
            <h2>Imagen de vacantes</h2>
            <p className="admin-note" style={{ marginTop: 0 }}>
              Recomendado: afiche horizontal o flyer con los puestos abiertos (JPG/PNG).
            </p>

            <label className="admin-vacantes-upload">
              <input type="file" accept="image/*" onChange={manejarImagen} />
              <span>{banner.imageDataUrl ? 'Cambiar imagen' : 'Subir imagen de vacantes'}</span>
            </label>

            {banner.imageDataUrl && (
              <button type="button" className="admin-vacantes-quitar" onClick={quitarImagen}>
                Quitar imagen
              </button>
            )}
          </section>

          <section className="admin-section">
            <h2>Texto del banner</h2>
            <label className="admin-vacantes-field">
              Título
              <input
                value={banner.titulo}
                onChange={(e) => setBanner((prev) => ({ ...prev, titulo: e.target.value }))}
                required
              />
            </label>
            <label className="admin-vacantes-field">
              Subtítulo
              <input
                value={banner.subtitulo}
                onChange={(e) => setBanner((prev) => ({ ...prev, subtitulo: e.target.value }))}
              />
            </label>
            <label className="admin-vacantes-check">
              <input
                type="checkbox"
                checked={banner.activo}
                onChange={(e) => setBanner((prev) => ({ ...prev, activo: e.target.checked }))}
              />
              Mostrar banner en el sitio web
            </label>
          </section>

          <button type="submit" className="btn btn--gradient" disabled={guardando}>
            {guardando ? 'Publicando…' : 'Publicar banner'}
          </button>

          {mensaje && <p className="admin-vacantes-msg">{mensaje}</p>}
        </form>

        <aside className="admin-vacantes-preview">
          <h2>Vista previa</h2>
          <div className={`vacantes-banner ${banner.activo ? '' : 'vacantes-banner--inactivo'}`}>
            {banner.imageDataUrl ? (
              <img src={banner.imageDataUrl} alt={banner.titulo} className="vacantes-banner__img" />
            ) : (
              <div className="vacantes-banner__placeholder">
                <span>Sin imagen — sube el afiche de vacantes</span>
              </div>
            )}
            <div className="vacantes-banner__overlay">
              <h3>{banner.titulo}</h3>
              {banner.subtitulo && <p>{banner.subtitulo}</p>}
            </div>
          </div>

          <p className="admin-note">
            Las postulaciones se gestionan en <strong>Solicitudes</strong>. Correo de RRHH:{' '}
            <strong>{emailRRHH}</strong>
          </p>
        </aside>
      </div>
    </>
  )
}
