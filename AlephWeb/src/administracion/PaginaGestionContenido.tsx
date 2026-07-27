/**
 * Panel para editar noticias, certificaciones, galería, industrias, servicios y config del sitio.
 */

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { AlertaCambiosSinGuardar } from './componentes/AlertaCambiosSinGuardar'
import { CampoImagenAdmin } from './componentes/CampoImagenAdmin'
import {
  cargarContenidoEditorialDesdeApi,
  certificacionVacia,
  contenidoEditorialDefecto,
  crearSlugNoticia,
  EVENTO_CONTENIDO_EDITORIAL,
  guardarContenidoEditorial,
  industriaVacia,
  noticiaVacia,
  obtenerContenidoEditorial,
  proyectoGaleriaVacio,
  areaTrabajoVacia,
  beneficioTrabajaVacio,
  faqTrabajaVacia,
  pasoProcesoVacio,
  servicioVacio,
  type ContenidoEditorial,
  type EnlaceBotonEditorial,
  type PasoProcesoServicios,
} from '../datos/contenidoEditorial'
import { snapshotFormulario, useFormularioSinGuardar } from '../hooks/useFormularioSinGuardar'
import type { Certificacion, Noticia, ProyectoGaleria } from '../tipos/indice'

type SeccionEditorial =
  | 'noticias'
  | 'certificaciones'
  | 'galeria'
  | 'industrias'
  | 'servicios'
  | 'trabaja'
  | 'nosotros'
  | 'sitio'

const SECCIONES: { id: SeccionEditorial; label: string }[] = [
  { id: 'noticias', label: 'Noticias' },
  { id: 'certificaciones', label: 'Certificaciones' },
  { id: 'galeria', label: 'Galería' },
  { id: 'industrias', label: 'Industrias' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'trabaja', label: 'Trabaja con nosotros' },
  { id: 'nosotros', label: 'Textos nosotros' },
  { id: 'sitio', label: 'Config. sitio' },
]

function CampoTexto({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
  required?: boolean
  type?: string
}) {
  return (
    <label className="admin-vacantes-field">
      {label}
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} required={required} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}
    </label>
  )
}

function CampoEnlace({
  label,
  value,
  onChange,
}: {
  label: string
  value: EnlaceBotonEditorial
  onChange: (v: EnlaceBotonEditorial) => void
}) {
  return (
    <fieldset className="admin-inicio-enlace">
      <legend>{label}</legend>
      <CampoTexto label="Texto del botón" value={value.texto} onChange={(texto) => onChange({ ...value, texto })} />
      <CampoTexto label="Enlace (ruta)" value={value.enlace} onChange={(enlace) => onChange({ ...value, enlace })} />
    </fieldset>
  )
}

export function PaginaGestionContenido() {
  const lineaBaseRef = useRef('')
  const [contenido, setContenido] = useState<ContenidoEditorial>(() => obtenerContenidoEditorial())
  const [seccion, setSeccion] = useState<SeccionEditorial>('noticias')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState<'ok' | 'error' | ''>('')
  const [sincronizando, setSincronizando] = useState(true)

  const hayCambios = useMemo(() => {
    if (sincronizando) return false
    return snapshotFormulario({ ...contenido, updatedAt: null }) !== lineaBaseRef.current
  }, [contenido, sincronizando])

  const { confirmarSiHayCambios } = useFormularioSinGuardar(hayCambios)

  useEffect(() => {
    let activo = true
    setSincronizando(true)

    cargarContenidoEditorialDesdeApi()
      .then((datos) => {
        if (activo) {
          setContenido(datos)
          lineaBaseRef.current = snapshotFormulario({ ...datos, updatedAt: null })
        }
      })
      .finally(() => {
        if (activo) setSincronizando(false)
      })

    function sincronizar() {
      setContenido(obtenerContenidoEditorial())
    }

    window.addEventListener(EVENTO_CONTENIDO_EDITORIAL, sincronizar)
    return () => {
      activo = false
      window.removeEventListener(EVENTO_CONTENIDO_EDITORIAL, sincronizar)
    }
  }, [])

  async function manejarGuardar(e: FormEvent) {
    e.preventDefault()
    setGuardando(true)
    setMensaje('')
    setTipoMensaje('')

    try {
      const guardado = await guardarContenidoEditorial(contenido)
      setContenido(guardado)
      lineaBaseRef.current = snapshotFormulario({ ...guardado, updatedAt: null })
      setMensaje('Contenido guardado correctamente.')
      setTipoMensaje('ok')
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo guardar.')
      setTipoMensaje('error')
    } finally {
      setGuardando(false)
    }
  }

  function actualizarNoticia(indice: number, parcial: Partial<Noticia>) {
    setContenido((prev) => {
      const noticias = [...prev.noticias]
      noticias[indice] = { ...noticias[indice], ...parcial }
      return { ...prev, noticias }
    })
  }

  function agregarNoticia() {
    setContenido((prev) => ({
      ...prev,
      noticias: [noticiaVacia(), ...prev.noticias],
    }))
  }

  function eliminarNoticia(indice: number) {
    const noticia = contenido.noticias[indice]
    if (!noticia) return
    if (!window.confirm(`¿Eliminar la noticia «${noticia.title || 'sin título'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      noticias: prev.noticias.filter((_, i) => i !== indice),
    }))
  }

  function actualizarCertificacion(indice: number, parcial: Partial<Certificacion>) {
    setContenido((prev) => {
      const certificaciones = [...prev.certificaciones]
      certificaciones[indice] = { ...certificaciones[indice], ...parcial }
      return { ...prev, certificaciones }
    })
  }

  function agregarCertificacion() {
    setContenido((prev) => ({
      ...prev,
      certificaciones: [...prev.certificaciones, certificacionVacia()],
    }))
  }

  function eliminarCertificacion(indice: number) {
    const cert = contenido.certificaciones[indice]
    if (!cert) return
    if (!window.confirm(`¿Eliminar «${cert.name || 'certificación'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      certificaciones: prev.certificaciones.filter((_, i) => i !== indice),
    }))
  }

  function actualizarGaleria(indice: number, parcial: Partial<ProyectoGaleria>) {
    setContenido((prev) => {
      const galeria = [...prev.galeria]
      galeria[indice] = { ...galeria[indice], ...parcial }
      return { ...prev, galeria }
    })
  }

  function agregarProyectoGaleria() {
    setContenido((prev) => ({
      ...prev,
      galeria: [...prev.galeria, proyectoGaleriaVacio()],
    }))
  }

  function eliminarProyectoGaleria(indice: number) {
    const proyecto = contenido.galeria[indice]
    if (!proyecto) return
    if (!window.confirm(`¿Eliminar «${proyecto.name || 'proyecto'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      galeria: prev.galeria.filter((_, i) => i !== indice),
    }))
  }

  function actualizarIndustria(indice: number, parcial: Partial<ContenidoEditorial['industrias'][0]>) {
    setContenido((prev) => {
      const industrias = [...prev.industrias]
      industrias[indice] = { ...industrias[indice], ...parcial }
      return { ...prev, industrias }
    })
  }

  function agregarIndustria() {
    setContenido((prev) => ({
      ...prev,
      industrias: [...prev.industrias, industriaVacia()],
    }))
  }

  function eliminarIndustria(indice: number) {
    const ind = contenido.industrias[indice]
    if (!ind) return
    if (!window.confirm(`¿Eliminar «${ind.name || 'industria'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      industrias: prev.industrias.filter((_, i) => i !== indice),
    }))
  }

  function actualizarServicio(indice: number, parcial: Partial<ContenidoEditorial['servicios'][0]>) {
    setContenido((prev) => {
      const servicios = [...prev.servicios]
      servicios[indice] = { ...servicios[indice], ...parcial }
      return { ...prev, servicios }
    })
  }

  function agregarServicio() {
    setContenido((prev) => ({
      ...prev,
      servicios: [...prev.servicios, servicioVacio()],
    }))
  }

  function eliminarServicio(indice: number) {
    const srv = contenido.servicios[indice]
    if (!srv) return
    if (!window.confirm(`¿Eliminar «${srv.name || 'servicio'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      servicios: prev.servicios.filter((_, i) => i !== indice),
    }))
  }

  function actualizarPasoProceso(indice: number, parcial: Partial<PasoProcesoServicios>) {
    setContenido((prev) => {
      const pasos = [...prev.paginaServicios.proceso.pasos]
      pasos[indice] = { ...pasos[indice], ...parcial }
      return {
        ...prev,
        paginaServicios: {
          ...prev.paginaServicios,
          proceso: { ...prev.paginaServicios.proceso, pasos },
        },
      }
    })
  }

  function agregarPasoProceso() {
    setContenido((prev) => ({
      ...prev,
      paginaServicios: {
        ...prev.paginaServicios,
        proceso: {
          ...prev.paginaServicios.proceso,
          pasos: [...prev.paginaServicios.proceso.pasos, pasoProcesoVacio()],
        },
      },
    }))
  }

  function eliminarPasoProceso(indice: number) {
    const paso = contenido.paginaServicios.proceso.pasos[indice]
    if (!paso) return
    if (!window.confirm(`¿Eliminar el paso «${paso.titulo || 'sin título'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      paginaServicios: {
        ...prev.paginaServicios,
        proceso: {
          ...prev.paginaServicios.proceso,
          pasos: prev.paginaServicios.proceso.pasos.filter((_, i) => i !== indice),
        },
      },
    }))
  }

  function actualizarPaginaServicios(
    parcial: Partial<ContenidoEditorial['paginaServicios']>,
  ) {
    setContenido((prev) => ({
      ...prev,
      paginaServicios: fusionarPaginaServiciosAdmin(prev.paginaServicios, parcial),
    }))
  }

  function fusionarPaginaServiciosAdmin(
    base: ContenidoEditorial['paginaServicios'],
    parcial: Partial<ContenidoEditorial['paginaServicios']>,
  ): ContenidoEditorial['paginaServicios'] {
    return {
      seoDescripcion: parcial.seoDescripcion ?? base.seoDescripcion,
      hero: {
        ...base.hero,
        ...parcial.hero,
        botonPrincipal: { ...base.hero.botonPrincipal, ...parcial.hero?.botonPrincipal },
        botonSecundario: { ...base.hero.botonSecundario, ...parcial.hero?.botonSecundario },
      },
      proceso: {
        ...base.proceso,
        ...parcial.proceso,
        pasos: parcial.proceso?.pasos ?? base.proceso.pasos,
      },
      listado: { ...base.listado, ...parcial.listado },
      cta: {
        ...base.cta,
        ...parcial.cta,
        botonPrincipal: { ...base.cta.botonPrincipal, ...parcial.cta?.botonPrincipal },
        botonSecundario: { ...base.cta.botonSecundario, ...parcial.cta?.botonSecundario },
      },
    }
  }

  function actualizarPaginaTrabaja(parcial: Partial<ContenidoEditorial['paginaTrabaja']>) {
    setContenido((prev) => ({
      ...prev,
      paginaTrabaja: fusionarPaginaTrabajaAdmin(prev.paginaTrabaja, parcial),
    }))
  }

  function fusionarPaginaTrabajaAdmin(
    base: ContenidoEditorial['paginaTrabaja'],
    parcial: Partial<ContenidoEditorial['paginaTrabaja']>,
  ): ContenidoEditorial['paginaTrabaja'] {
    return {
      seoDescripcion: parcial.seoDescripcion ?? base.seoDescripcion,
      hero: {
        ...base.hero,
        ...parcial.hero,
        botonVacantes: { ...base.hero.botonVacantes, ...parcial.hero?.botonVacantes },
        botonPostular: { ...base.hero.botonPostular, ...parcial.hero?.botonPostular },
      },
      vacantes: { ...base.vacantes, ...parcial.vacantes },
      areas: {
        ...base.areas,
        ...parcial.areas,
        items: parcial.areas?.items ?? base.areas.items,
      },
      beneficios: {
        ...base.beneficios,
        ...parcial.beneficios,
        items: parcial.beneficios?.items ?? base.beneficios.items,
      },
      formulario: { ...base.formulario, ...parcial.formulario },
      proceso: {
        ...base.proceso,
        ...parcial.proceso,
        pasos: parcial.proceso?.pasos ?? base.proceso.pasos,
      },
      faq: {
        ...base.faq,
        ...parcial.faq,
        items: parcial.faq?.items ?? base.faq.items,
      },
    }
  }

  function actualizarAreaTrabaja(indice: number, parcial: Partial<ContenidoEditorial['paginaTrabaja']['areas']['items'][0]>) {
    setContenido((prev) => {
      const items = [...prev.paginaTrabaja.areas.items]
      items[indice] = { ...items[indice], ...parcial }
      return {
        ...prev,
        paginaTrabaja: {
          ...prev.paginaTrabaja,
          areas: { ...prev.paginaTrabaja.areas, items },
        },
      }
    })
  }

  function agregarAreaTrabaja() {
    setContenido((prev) => ({
      ...prev,
      paginaTrabaja: {
        ...prev.paginaTrabaja,
        areas: {
          ...prev.paginaTrabaja.areas,
          items: [...prev.paginaTrabaja.areas.items, areaTrabajoVacia()],
        },
      },
    }))
  }

  function eliminarAreaTrabaja(indice: number) {
    const area = contenido.paginaTrabaja.areas.items[indice]
    if (!area) return
    if (!window.confirm(`¿Eliminar el área «${area.name || 'sin nombre'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      paginaTrabaja: {
        ...prev.paginaTrabaja,
        areas: {
          ...prev.paginaTrabaja.areas,
          items: prev.paginaTrabaja.areas.items.filter((_, i) => i !== indice),
        },
      },
    }))
  }

  function actualizarBeneficioTrabaja(
    indice: number,
    parcial: Partial<ContenidoEditorial['paginaTrabaja']['beneficios']['items'][0]>,
  ) {
    setContenido((prev) => {
      const items = [...prev.paginaTrabaja.beneficios.items]
      items[indice] = { ...items[indice], ...parcial }
      return {
        ...prev,
        paginaTrabaja: {
          ...prev.paginaTrabaja,
          beneficios: { ...prev.paginaTrabaja.beneficios, items },
        },
      }
    })
  }

  function agregarBeneficioTrabaja() {
    setContenido((prev) => ({
      ...prev,
      paginaTrabaja: {
        ...prev.paginaTrabaja,
        beneficios: {
          ...prev.paginaTrabaja.beneficios,
          items: [...prev.paginaTrabaja.beneficios.items, beneficioTrabajaVacio()],
        },
      },
    }))
  }

  function eliminarBeneficioTrabaja(indice: number) {
    const item = contenido.paginaTrabaja.beneficios.items[indice]
    if (!item) return
    if (!window.confirm(`¿Eliminar el beneficio «${item.titulo || 'sin título'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      paginaTrabaja: {
        ...prev.paginaTrabaja,
        beneficios: {
          ...prev.paginaTrabaja.beneficios,
          items: prev.paginaTrabaja.beneficios.items.filter((_, i) => i !== indice),
        },
      },
    }))
  }

  function actualizarPasoTrabaja(indice: number, parcial: Partial<PasoProcesoServicios>) {
    setContenido((prev) => {
      const pasos = [...prev.paginaTrabaja.proceso.pasos]
      pasos[indice] = { ...pasos[indice], ...parcial }
      return {
        ...prev,
        paginaTrabaja: {
          ...prev.paginaTrabaja,
          proceso: { ...prev.paginaTrabaja.proceso, pasos },
        },
      }
    })
  }

  function agregarPasoTrabaja() {
    setContenido((prev) => ({
      ...prev,
      paginaTrabaja: {
        ...prev.paginaTrabaja,
        proceso: {
          ...prev.paginaTrabaja.proceso,
          pasos: [...prev.paginaTrabaja.proceso.pasos, pasoProcesoVacio()],
        },
      },
    }))
  }

  function eliminarPasoTrabaja(indice: number) {
    const paso = contenido.paginaTrabaja.proceso.pasos[indice]
    if (!paso) return
    if (!window.confirm(`¿Eliminar el paso «${paso.titulo || 'sin título'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      paginaTrabaja: {
        ...prev.paginaTrabaja,
        proceso: {
          ...prev.paginaTrabaja.proceso,
          pasos: prev.paginaTrabaja.proceso.pasos.filter((_, i) => i !== indice),
        },
      },
    }))
  }

  function actualizarFaqTrabaja(
    indice: number,
    parcial: Partial<ContenidoEditorial['paginaTrabaja']['faq']['items'][0]>,
  ) {
    setContenido((prev) => {
      const items = [...prev.paginaTrabaja.faq.items]
      items[indice] = { ...items[indice], ...parcial }
      return {
        ...prev,
        paginaTrabaja: {
          ...prev.paginaTrabaja,
          faq: { ...prev.paginaTrabaja.faq, items },
        },
      }
    })
  }

  function agregarFaqTrabaja() {
    setContenido((prev) => ({
      ...prev,
      paginaTrabaja: {
        ...prev.paginaTrabaja,
        faq: {
          ...prev.paginaTrabaja.faq,
          items: [...prev.paginaTrabaja.faq.items, faqTrabajaVacia()],
        },
      },
    }))
  }

  function eliminarFaqTrabaja(indice: number) {
    const item = contenido.paginaTrabaja.faq.items[indice]
    if (!item) return
    if (!window.confirm(`¿Eliminar la pregunta «${item.pregunta || 'sin texto'}»?`)) return
    setContenido((prev) => ({
      ...prev,
      paginaTrabaja: {
        ...prev.paginaTrabaja,
        faq: {
          ...prev.paginaTrabaja.faq,
          items: prev.paginaTrabaja.faq.items.filter((_, i) => i !== indice),
        },
      },
    }))
  }

  async function restablecerDefecto() {
    if (!confirmarSiHayCambios()) return
    if (!window.confirm('¿Restablecer todo el contenido editorial a los valores por defecto?')) return
    setContenido(contenidoEditorialDefecto())
    setMensaje('Valores por defecto cargados. Guarda para aplicar en la base de datos.')
    setTipoMensaje('ok')
  }

  return (
    <>
      <MetaPagina title="Admin - Contenido editorial" />
      <div className="admin-header-row">
        <div>
          <h1>Contenido editorial</h1>
          <p className="admin-subtitle">
            Noticias, certificaciones, galería, industrias, servicios y configuración del sitio
          </p>
        </div>
        <button type="button" className="btn btn--ghost" onClick={() => void restablecerDefecto()}>
          Restablecer defaults
        </button>
      </div>

      {sincronizando && <p className="admin-vacantes-msg">Sincronizando con la base de datos…</p>}
      {mensaje && (
        <p className={`admin-vacantes-msg ${tipoMensaje === 'error' ? 'admin-vacantes-msg--error' : ''}`}>
          {mensaje}
        </p>
      )}

      <nav className="admin-inicio-tabs" aria-label="Secciones editoriales">
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={seccion === s.id ? 'admin-inicio-tabs__tab admin-inicio-tabs__tab--activo' : 'admin-inicio-tabs__tab'}
            onClick={() => setSeccion(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <form className="admin-inicio-form" onSubmit={manejarGuardar}>
        <AlertaCambiosSinGuardar visible={hayCambios} />
        {seccion === 'noticias' && (
          <section>
            <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
              <h2>Noticias</h2>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarNoticia}>
                + Nueva noticia
              </button>
            </div>
            {contenido.noticias.map((noticia, i) => (
              <div key={noticia.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>{noticia.title || `Noticia ${i + 1}`}</strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarNoticia(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto
                  label="Título"
                  value={noticia.title}
                  onChange={(title) => {
                    const slug = crearSlugNoticia(title, contenido.noticias, noticia.id)
                    actualizarNoticia(i, { title, slug })
                  }}
                  required
                />
                <CampoTexto label="Slug (URL)" value={noticia.slug} onChange={(slug) => actualizarNoticia(i, { slug })} />
                <CampoTexto label="Fecha" type="date" value={noticia.date} onChange={(date) => actualizarNoticia(i, { date })} />
                <CampoTexto label="Extracto" value={noticia.excerpt} onChange={(excerpt) => actualizarNoticia(i, { excerpt })} multiline />
                <CampoTexto label="Contenido" value={noticia.content} onChange={(content) => actualizarNoticia(i, { content })} multiline />
                <CampoImagenAdmin
                  etiqueta="Imagen destacada"
                  valor={noticia.image || null}
                  onChange={(image) => actualizarNoticia(i, { image: image ?? '' })}
                />
              </div>
            ))}
          </section>
        )}

        {seccion === 'certificaciones' && (
          <section>
            <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
              <h2>Certificaciones</h2>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarCertificacion}>
                + Nueva certificación
              </button>
            </div>
            {contenido.certificaciones.map((cert, i) => (
              <div key={cert.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>{cert.name || `Certificación ${i + 1}`}</strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarCertificacion(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto label="Nombre" value={cert.name} onChange={(name) => actualizarCertificacion(i, { name })} />
                <CampoTexto label="Emisor" value={cert.issuer} onChange={(issuer) => actualizarCertificacion(i, { issuer })} />
                <CampoTexto label="Año" value={cert.year} onChange={(year) => actualizarCertificacion(i, { year })} />
                <CampoTexto label="Descripción" value={cert.description} onChange={(description) => actualizarCertificacion(i, { description })} multiline />
                <CampoImagenAdmin
                  etiqueta="Imagen"
                  valor={cert.image || null}
                  onChange={(image) => actualizarCertificacion(i, { image: image ?? '' })}
                />
              </div>
            ))}
          </section>
        )}

        {seccion === 'galeria' && (
          <section>
            <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
              <h2>Galería de proyectos</h2>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarProyectoGaleria}>
                + Nuevo proyecto
              </button>
            </div>
            {contenido.galeria.map((proyecto, i) => (
              <div key={proyecto.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>{proyecto.name || `Proyecto ${i + 1}`}</strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarProyectoGaleria(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto label="Nombre" value={proyecto.name} onChange={(name) => actualizarGaleria(i, { name })} />
                <CampoTexto label="Tipo de producto" value={proyecto.productType} onChange={(productType) => actualizarGaleria(i, { productType })} />
                <CampoTexto label="Cliente (opcional)" value={proyecto.client ?? ''} onChange={(client) => actualizarGaleria(i, { client: client || undefined })} />
                <CampoTexto label="Descripción" value={proyecto.description} onChange={(description) => actualizarGaleria(i, { description })} multiline />
                <CampoImagenAdmin
                  etiqueta="Imagen"
                  valor={proyecto.image || null}
                  onChange={(image) => actualizarGaleria(i, { image: image ?? '' })}
                />
              </div>
            ))}
          </section>
        )}

        {seccion === 'industrias' && (
          <section>
            <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
              <h2>Industrias</h2>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarIndustria}>
                + Nueva industria
              </button>
            </div>
            {contenido.industrias.map((ind, i) => (
              <div key={ind.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>{ind.icon} {ind.name || `Industria ${i + 1}`}</strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarIndustria(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto label="Icono (emoji)" value={ind.icon} onChange={(icon) => actualizarIndustria(i, { icon })} />
                <CampoTexto label="Nombre" value={ind.name} onChange={(name) => actualizarIndustria(i, { name })} />
                <CampoTexto label="Descripción" value={ind.description} onChange={(description) => actualizarIndustria(i, { description })} multiline />
              </div>
            ))}
          </section>
        )}

        {seccion === 'servicios' && (
          <section>
            <h2>Página Servicios — textos generales</h2>
            <CampoTexto
              label="Descripción SEO"
              value={contenido.paginaServicios.seoDescripcion}
              onChange={(seoDescripcion) => actualizarPaginaServicios({ seoDescripcion })}
              multiline
            />

            <h3 className="admin-inicio-subseccion">Hero</h3>
            <CampoTexto
              label="Etiqueta superior"
              value={contenido.paginaServicios.hero.etiqueta}
              onChange={(etiqueta) =>
                actualizarPaginaServicios({ hero: { ...contenido.paginaServicios.hero, etiqueta } })
              }
            />
            <CampoTexto
              label="Título (antes del destacado)"
              value={contenido.paginaServicios.hero.tituloAntes}
              onChange={(tituloAntes) =>
                actualizarPaginaServicios({ hero: { ...contenido.paginaServicios.hero, tituloAntes } })
              }
            />
            <CampoTexto
              label="Título destacado (cursiva / cyan)"
              value={contenido.paginaServicios.hero.tituloDestacado}
              onChange={(tituloDestacado) =>
                actualizarPaginaServicios({ hero: { ...contenido.paginaServicios.hero, tituloDestacado } })
              }
            />
            <CampoTexto
              label="Título (después del destacado)"
              value={contenido.paginaServicios.hero.tituloDespues}
              onChange={(tituloDespues) =>
                actualizarPaginaServicios({ hero: { ...contenido.paginaServicios.hero, tituloDespues } })
              }
            />
            <CampoTexto
              label="Párrafo del hero"
              value={contenido.paginaServicios.hero.parrafo}
              onChange={(parrafo) =>
                actualizarPaginaServicios({ hero: { ...contenido.paginaServicios.hero, parrafo } })
              }
              multiline
            />
            <CampoEnlace
              label="Botón principal del hero"
              value={contenido.paginaServicios.hero.botonPrincipal}
              onChange={(botonPrincipal) =>
                actualizarPaginaServicios({ hero: { ...contenido.paginaServicios.hero, botonPrincipal } })
              }
            />
            <CampoEnlace
              label="Botón secundario del hero"
              value={contenido.paginaServicios.hero.botonSecundario}
              onChange={(botonSecundario) =>
                actualizarPaginaServicios({ hero: { ...contenido.paginaServicios.hero, botonSecundario } })
              }
            />
            <CampoTexto
              label="Panel lateral — etiqueta"
              value={contenido.paginaServicios.hero.panelEtiqueta}
              onChange={(panelEtiqueta) =>
                actualizarPaginaServicios({ hero: { ...contenido.paginaServicios.hero, panelEtiqueta } })
              }
            />
            <CampoTexto
              label="Panel lateral — texto"
              value={contenido.paginaServicios.hero.panelTexto}
              onChange={(panelTexto) =>
                actualizarPaginaServicios({ hero: { ...contenido.paginaServicios.hero, panelTexto } })
              }
            />

            <h3 className="admin-inicio-subseccion">Sección «Cómo trabajamos»</h3>
            <CampoTexto
              label="Título"
              value={contenido.paginaServicios.proceso.titulo}
              onChange={(titulo) =>
                actualizarPaginaServicios({
                  proceso: { ...contenido.paginaServicios.proceso, titulo },
                })
              }
            />
            <CampoTexto
              label="Subtítulo"
              value={contenido.paginaServicios.proceso.subtitulo}
              onChange={(subtitulo) =>
                actualizarPaginaServicios({
                  proceso: { ...contenido.paginaServicios.proceso, subtitulo },
                })
              }
            />
            <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
              <h4>Pasos del proceso</h4>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarPasoProceso}>
                + Nuevo paso
              </button>
            </div>
            {contenido.paginaServicios.proceso.pasos.map((paso, i) => (
              <div key={paso.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>Paso {i + 1}: {paso.titulo || 'Sin título'}</strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarPasoProceso(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto label="Título" value={paso.titulo} onChange={(titulo) => actualizarPasoProceso(i, { titulo })} />
                <CampoTexto label="Descripción" value={paso.texto} onChange={(texto) => actualizarPasoProceso(i, { texto })} multiline />
              </div>
            ))}

            <h3 className="admin-inicio-subseccion">Sección «Nuestros servicios»</h3>
            <CampoTexto
              label="Título"
              value={contenido.paginaServicios.listado.titulo}
              onChange={(titulo) =>
                actualizarPaginaServicios({ listado: { ...contenido.paginaServicios.listado, titulo } })
              }
            />
            <CampoTexto
              label="Subtítulo"
              value={contenido.paginaServicios.listado.subtitulo}
              onChange={(subtitulo) =>
                actualizarPaginaServicios({ listado: { ...contenido.paginaServicios.listado, subtitulo } })
              }
              multiline
            />

            <div className="admin-header-row" style={{ margin: '1.5rem 0 1rem' }}>
              <h4>Tarjetas de servicios</h4>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarServicio}>
                + Nuevo servicio
              </button>
            </div>
            {contenido.servicios.map((srv, i) => (
              <div key={srv.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>{srv.name || `Servicio ${i + 1}`}</strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarServicio(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto label="Nombre" value={srv.name} onChange={(name) => actualizarServicio(i, { name })} />
                <CampoTexto label="Descripción" value={srv.description} onChange={(description) => actualizarServicio(i, { description })} multiline />
              </div>
            ))}

            <h3 className="admin-inicio-subseccion">CTA final</h3>
            <CampoTexto
              label="Título"
              value={contenido.paginaServicios.cta.titulo}
              onChange={(titulo) =>
                actualizarPaginaServicios({ cta: { ...contenido.paginaServicios.cta, titulo } })
              }
            />
            <CampoTexto
              label="Texto"
              value={contenido.paginaServicios.cta.texto}
              onChange={(texto) =>
                actualizarPaginaServicios({ cta: { ...contenido.paginaServicios.cta, texto } })
              }
              multiline
            />
            <CampoEnlace
              label="Botón principal del CTA"
              value={contenido.paginaServicios.cta.botonPrincipal}
              onChange={(botonPrincipal) =>
                actualizarPaginaServicios({ cta: { ...contenido.paginaServicios.cta, botonPrincipal } })
              }
            />
            <CampoEnlace
              label="Botón secundario del CTA"
              value={contenido.paginaServicios.cta.botonSecundario}
              onChange={(botonSecundario) =>
                actualizarPaginaServicios({ cta: { ...contenido.paginaServicios.cta, botonSecundario } })
              }
            />
          </section>
        )}

        {seccion === 'trabaja' && (
          <section>
            <h2>Página Trabaja con nosotros</h2>
            <p className="admin-subtitle">
              El afiche de vacantes se publica en <strong>Vacantes RRHH</strong>. Aquí editas textos,
              áreas, beneficios, proceso y FAQ.
            </p>

            <CampoTexto
              label="Descripción SEO"
              value={contenido.paginaTrabaja.seoDescripcion}
              onChange={(seoDescripcion) => actualizarPaginaTrabaja({ seoDescripcion })}
              multiline
            />

            <h3 className="admin-inicio-subseccion">Hero</h3>
            <CampoTexto
              label="Etiqueta superior"
              value={contenido.paginaTrabaja.hero.etiqueta}
              onChange={(etiqueta) =>
                actualizarPaginaTrabaja({ hero: { ...contenido.paginaTrabaja.hero, etiqueta } })
              }
            />
            <CampoTexto
              label="Título (antes del destacado)"
              value={contenido.paginaTrabaja.hero.tituloAntes}
              onChange={(tituloAntes) =>
                actualizarPaginaTrabaja({ hero: { ...contenido.paginaTrabaja.hero, tituloAntes } })
              }
            />
            <CampoTexto
              label="Título destacado"
              value={contenido.paginaTrabaja.hero.tituloDestacado}
              onChange={(tituloDestacado) =>
                actualizarPaginaTrabaja({ hero: { ...contenido.paginaTrabaja.hero, tituloDestacado } })
              }
            />
            <CampoTexto
              label="Título (después del destacado)"
              value={contenido.paginaTrabaja.hero.tituloDespues}
              onChange={(tituloDespues) =>
                actualizarPaginaTrabaja({ hero: { ...contenido.paginaTrabaja.hero, tituloDespues } })
              }
            />
            <CampoTexto
              label="Párrafo del hero"
              value={contenido.paginaTrabaja.hero.parrafo}
              onChange={(parrafo) =>
                actualizarPaginaTrabaja({ hero: { ...contenido.paginaTrabaja.hero, parrafo } })
              }
              multiline
            />
            <CampoEnlace
              label="Botón ver vacantes (ancla, ej. #vacantes)"
              value={contenido.paginaTrabaja.hero.botonVacantes}
              onChange={(botonVacantes) =>
                actualizarPaginaTrabaja({ hero: { ...contenido.paginaTrabaja.hero, botonVacantes } })
              }
            />
            <CampoEnlace
              label="Botón enviar CV (ancla, ej. #postulacion)"
              value={contenido.paginaTrabaja.hero.botonPostular}
              onChange={(botonPostular) =>
                actualizarPaginaTrabaja({ hero: { ...contenido.paginaTrabaja.hero, botonPostular } })
              }
            />
            <CampoTexto
              label="Etiqueta del panel visual"
              value={contenido.paginaTrabaja.hero.panelEtiqueta}
              onChange={(panelEtiqueta) =>
                actualizarPaginaTrabaja({ hero: { ...contenido.paginaTrabaja.hero, panelEtiqueta } })
              }
            />
            <CampoTexto
              label="Texto del panel visual"
              value={contenido.paginaTrabaja.hero.panelTexto}
              onChange={(panelTexto) =>
                actualizarPaginaTrabaja({ hero: { ...contenido.paginaTrabaja.hero, panelTexto } })
              }
            />

            <h3 className="admin-inicio-subseccion">Sección vacantes (textos)</h3>
            <CampoTexto
              label="Título vacantes"
              value={contenido.paginaTrabaja.vacantes.titulo}
              onChange={(titulo) =>
                actualizarPaginaTrabaja({ vacantes: { ...contenido.paginaTrabaja.vacantes, titulo } })
              }
            />
            <CampoTexto
              label="Subtítulo vacantes"
              value={contenido.paginaTrabaja.vacantes.subtitulo}
              onChange={(subtitulo) =>
                actualizarPaginaTrabaja({ vacantes: { ...contenido.paginaTrabaja.vacantes, subtitulo } })
              }
            />
            <CampoTexto
              label="Título sin vacantes"
              value={contenido.paginaTrabaja.vacantes.sinVacantesTitulo}
              onChange={(sinVacantesTitulo) =>
                actualizarPaginaTrabaja({
                  vacantes: { ...contenido.paginaTrabaja.vacantes, sinVacantesTitulo },
                })
              }
            />
            <CampoTexto
              label="Texto sin vacantes"
              value={contenido.paginaTrabaja.vacantes.sinVacantesTexto}
              onChange={(sinVacantesTexto) =>
                actualizarPaginaTrabaja({
                  vacantes: { ...contenido.paginaTrabaja.vacantes, sinVacantesTexto },
                })
              }
              multiline
            />

            <h3 className="admin-inicio-subseccion">Áreas de trabajo</h3>
            <CampoTexto
              label="Título sección áreas"
              value={contenido.paginaTrabaja.areas.titulo}
              onChange={(titulo) =>
                actualizarPaginaTrabaja({ areas: { ...contenido.paginaTrabaja.areas, titulo } })
              }
            />
            <CampoTexto
              label="Subtítulo sección áreas"
              value={contenido.paginaTrabaja.areas.subtitulo}
              onChange={(subtitulo) =>
                actualizarPaginaTrabaja({ areas: { ...contenido.paginaTrabaja.areas, subtitulo } })
              }
            />
            <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
              <strong>Tarjetas de áreas</strong>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarAreaTrabaja}>
                + Nueva área
              </button>
            </div>
            {contenido.paginaTrabaja.areas.items.map((area, i) => (
              <div key={area.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>
                    {area.icon} {area.name || `Área ${i + 1}`}
                  </strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarAreaTrabaja(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto
                  label="ID (para formulario, ej. produccion)"
                  value={area.id}
                  onChange={(id) => actualizarAreaTrabaja(i, { id })}
                />
                <CampoTexto label="Icono (emoji)" value={area.icon} onChange={(icon) => actualizarAreaTrabaja(i, { icon })} />
                <CampoTexto label="Nombre" value={area.name} onChange={(name) => actualizarAreaTrabaja(i, { name })} />
                <CampoTexto
                  label="Descripción"
                  value={area.description}
                  onChange={(description) => actualizarAreaTrabaja(i, { description })}
                  multiline
                />
              </div>
            ))}

            <h3 className="admin-inicio-subseccion">Beneficios</h3>
            <CampoTexto
              label="Título beneficios"
              value={contenido.paginaTrabaja.beneficios.titulo}
              onChange={(titulo) =>
                actualizarPaginaTrabaja({ beneficios: { ...contenido.paginaTrabaja.beneficios, titulo } })
              }
            />
            <CampoTexto
              label="Subtítulo beneficios"
              value={contenido.paginaTrabaja.beneficios.subtitulo}
              onChange={(subtitulo) =>
                actualizarPaginaTrabaja({ beneficios: { ...contenido.paginaTrabaja.beneficios, subtitulo } })
              }
            />
            <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
              <strong>Tarjetas de beneficios</strong>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarBeneficioTrabaja}>
                + Nuevo beneficio
              </button>
            </div>
            {contenido.paginaTrabaja.beneficios.items.map((item, i) => (
              <div key={item.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>
                    {item.icon} {item.titulo || `Beneficio ${i + 1}`}
                  </strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarBeneficioTrabaja(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto label="Icono" value={item.icon} onChange={(icon) => actualizarBeneficioTrabaja(i, { icon })} />
                <CampoTexto label="Título" value={item.titulo} onChange={(titulo) => actualizarBeneficioTrabaja(i, { titulo })} />
                <CampoTexto label="Texto" value={item.texto} onChange={(texto) => actualizarBeneficioTrabaja(i, { texto })} multiline />
              </div>
            ))}

            <h3 className="admin-inicio-subseccion">Formulario de postulación</h3>
            <CampoTexto
              label="Título del formulario"
              value={contenido.paginaTrabaja.formulario.titulo}
              onChange={(titulo) =>
                actualizarPaginaTrabaja({ formulario: { ...contenido.paginaTrabaja.formulario, titulo } })
              }
            />
            <CampoTexto
              label="Subtítulo del formulario"
              value={contenido.paginaTrabaja.formulario.subtitulo}
              onChange={(subtitulo) =>
                actualizarPaginaTrabaja({ formulario: { ...contenido.paginaTrabaja.formulario, subtitulo } })
              }
            />
            <CampoTexto
              label="Nota de privacidad"
              value={contenido.paginaTrabaja.formulario.notaPrivacidad}
              onChange={(notaPrivacidad) =>
                actualizarPaginaTrabaja({ formulario: { ...contenido.paginaTrabaja.formulario, notaPrivacidad } })
              }
              multiline
            />

            <h3 className="admin-inicio-subseccion">Proceso de selección</h3>
            <CampoTexto
              label="Título proceso"
              value={contenido.paginaTrabaja.proceso.titulo}
              onChange={(titulo) =>
                actualizarPaginaTrabaja({ proceso: { ...contenido.paginaTrabaja.proceso, titulo } })
              }
            />
            <CampoTexto
              label="Subtítulo proceso"
              value={contenido.paginaTrabaja.proceso.subtitulo}
              onChange={(subtitulo) =>
                actualizarPaginaTrabaja({ proceso: { ...contenido.paginaTrabaja.proceso, subtitulo } })
              }
            />
            <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
              <strong>Pasos</strong>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarPasoTrabaja}>
                + Nuevo paso
              </button>
            </div>
            {contenido.paginaTrabaja.proceso.pasos.map((paso, i) => (
              <div key={paso.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>{paso.titulo || `Paso ${i + 1}`}</strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarPasoTrabaja(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto label="Título" value={paso.titulo} onChange={(titulo) => actualizarPasoTrabaja(i, { titulo })} />
                <CampoTexto label="Texto" value={paso.texto} onChange={(texto) => actualizarPasoTrabaja(i, { texto })} multiline />
              </div>
            ))}

            <h3 className="admin-inicio-subseccion">Preguntas frecuentes</h3>
            <CampoTexto
              label="Título FAQ"
              value={contenido.paginaTrabaja.faq.titulo}
              onChange={(titulo) =>
                actualizarPaginaTrabaja({ faq: { ...contenido.paginaTrabaja.faq, titulo } })
              }
            />
            <div className="admin-header-row" style={{ marginBottom: '1rem' }}>
              <strong>Preguntas</strong>
              <button type="button" className="btn btn--primary btn--sm" onClick={agregarFaqTrabaja}>
                + Nueva pregunta
              </button>
            </div>
            {contenido.paginaTrabaja.faq.items.map((item, i) => (
              <div key={item.id} className="admin-inicio-tarjeta">
                <div className="admin-inicio-tarjeta__header">
                  <strong>{item.pregunta || `Pregunta ${i + 1}`}</strong>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => eliminarFaqTrabaja(i)}>
                    Eliminar
                  </button>
                </div>
                <CampoTexto label="Pregunta" value={item.pregunta} onChange={(pregunta) => actualizarFaqTrabaja(i, { pregunta })} />
                <CampoTexto label="Respuesta" value={item.respuesta} onChange={(respuesta) => actualizarFaqTrabaja(i, { respuesta })} multiline />
              </div>
            ))}
          </section>
        )}

        {seccion === 'nosotros' && (
          <section>
            <h2>Textos en página Nosotros</h2>
            <CampoTexto
              label="Título sección certificaciones"
              value={contenido.paginaNosotros.certificacionesTitulo}
              onChange={(certificacionesTitulo) =>
                setContenido((p) => ({
                  ...p,
                  paginaNosotros: { ...p.paginaNosotros, certificacionesTitulo },
                }))
              }
            />
            <CampoTexto
              label="Subtítulo certificaciones"
              value={contenido.paginaNosotros.certificacionesSubtitulo}
              onChange={(certificacionesSubtitulo) =>
                setContenido((p) => ({
                  ...p,
                  paginaNosotros: { ...p.paginaNosotros, certificacionesSubtitulo },
                }))
              }
            />
            <CampoTexto
              label="Título sección equipo"
              value={contenido.paginaNosotros.equipoTitulo}
              onChange={(equipoTitulo) =>
                setContenido((p) => ({
                  ...p,
                  paginaNosotros: { ...p.paginaNosotros, equipoTitulo },
                }))
              }
            />
            <CampoTexto
              label="Texto sección equipo"
              value={contenido.paginaNosotros.equipoTexto}
              onChange={(equipoTexto) =>
                setContenido((p) => ({
                  ...p,
                  paginaNosotros: { ...p.paginaNosotros, equipoTexto },
                }))
              }
              multiline
            />
          </section>
        )}

        {seccion === 'sitio' && (
          <section>
            <h2>Configuración del sitio</h2>
            <p className="admin-subtitle">Tagline del footer, horarios y correo de RRHH.</p>
            <CampoTexto
              label="Tagline (footer)"
              value={contenido.sitio.tagline}
              onChange={(tagline) =>
                setContenido((p) => ({ ...p, sitio: { ...p.sitio, tagline } }))
              }
              multiline
            />
            <CampoTexto
              label="Email RRHH"
              type="email"
              value={contenido.sitio.emailRRHH}
              onChange={(emailRRHH) =>
                setContenido((p) => ({ ...p, sitio: { ...p.sitio, emailRRHH } }))
              }
            />
            <fieldset className="admin-inicio-enlace">
              <legend>Horarios de atención</legend>
              {contenido.sitio.horarios.map((horario, i) => (
                <div key={i} className="admin-inicio-tarjeta__header">
                  <CampoTexto
                    label={`Horario ${i + 1}`}
                    value={horario}
                    onChange={(valor) => {
                      const horarios = [...contenido.sitio.horarios]
                      horarios[i] = valor
                      setContenido((p) => ({ ...p, sitio: { ...p.sitio, horarios } }))
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => {
                      setContenido((p) => ({
                        ...p,
                        sitio: {
                          ...p.sitio,
                          horarios: p.sitio.horarios.filter((_, j) => j !== i),
                        },
                      }))
                    }}
                  >
                    Quitar
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() =>
                  setContenido((p) => ({
                    ...p,
                    sitio: { ...p.sitio, horarios: [...p.sitio.horarios, ''] },
                  }))
                }
              >
                + Agregar horario
              </button>
            </fieldset>
          </section>
        )}

        <div className="admin-inicio-acciones">
          <button type="submit" className="btn btn--primary" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </>
  )
}
