/**
 * @file PaginaTrabajaConNosotros.tsx
 * @description Vacantes de RRHH, áreas de trabajo, formulario de postulación y cultura laboral.
 */

import { useEffect, useRef, useState, type DragEvent, type FormEvent } from 'react'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton, TituloSeccion } from '../componentes/interfaz/Boton'
import { configuracionSitio } from '../datos/configuracionSitio'
import { enviarPostulacionRRHH } from '../datos/postulacionesRRHH'
import { useContenidoEditorial } from '../hooks/useContenidoEditorial'
import {
  EVENTO_BANNER_VACANTES,
  obtenerBannerVacantes,
  type BannerVacantesRRHH,
} from '../datos/vacantesRRHH'

const ARCHIVOS_CV = '.pdf,.doc,.docx'
const MAX_CV_MB = 5
const ACENTOS = ['c', 'm', 'y', 'k'] as const

const formularioInicial = {
  name: '',
  email: '',
  phone: '',
  city: '',
  area: '',
  experience: '',
  message: '',
}

function irA(ancla: string) {
  const destino = ancla.startsWith('#') ? ancla : `#${ancla}`
  document.querySelector(destino)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function PaginaTrabajaConNosotros() {
  const { paginaTrabaja } = useContenidoEditorial()
  const { hero, vacantes, areas, formulario, proceso, faq } = paginaTrabaja
  const emailRRHH = configuracionSitio.emailRRHH

  const [banner, setBanner] = useState<BannerVacantesRRHH>(() => obtenerBannerVacantes())
  const [form, setForm] = useState(formularioInicial)
  const [cv, setCv] = useState<File | null>(null)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorCv, setErrorCv] = useState('')
  const [lightboxAbierto, setLightboxAbierto] = useState(false)
  const inputCvRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function actualizarBanner() {
      setBanner(obtenerBannerVacantes())
    }
    window.addEventListener(EVENTO_BANNER_VACANTES, actualizarBanner)
    window.addEventListener('storage', actualizarBanner)
    return () => {
      window.removeEventListener(EVENTO_BANNER_VACANTES, actualizarBanner)
      window.removeEventListener('storage', actualizarBanner)
    }
  }, [])

  useEffect(() => {
    if (!lightboxAbierto) return
    function cerrarConEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxAbierto(false)
    }
    window.addEventListener('keydown', cerrarConEscape)
    return () => window.removeEventListener('keydown', cerrarConEscape)
  }, [lightboxAbierto])

  function manejarCambio(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function validarArchivo(archivo: File | null) {
    if (!archivo) {
      setErrorCv('Debes adjuntar tu hoja de vida.')
      return false
    }
    if (archivo.size > MAX_CV_MB * 1024 * 1024) {
      setErrorCv(`El archivo no puede superar ${MAX_CV_MB} MB.`)
      return false
    }
    setErrorCv('')
    return true
  }

  function asignarCv(archivo: File | null) {
    if (archivo && !validarArchivo(archivo)) {
      setCv(null)
      if (inputCvRef.current) inputCvRef.current.value = ''
      return
    }

    setCv(archivo)

    if (!inputCvRef.current) return

    if (archivo) {
      const transferencia = new DataTransfer()
      transferencia.items.add(archivo)
      inputCvRef.current.files = transferencia.files
    } else {
      inputCvRef.current.value = ''
    }
  }

  function manejarDrop(e: DragEvent) {
    e.preventDefault()
    asignarCv(e.dataTransfer.files?.[0] ?? null)
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    if (!validarArchivo(cv) || !cv) return

    setEnviando(true)
    const areaLabel =
      form.area === 'otro'
        ? 'Otra área'
        : (areas.items.find((a) => a.id === form.area)?.name ?? form.area)

    try {
      await enviarPostulacionRRHH({ ...form, areaLabel, cv })
      setEnviado(true)
      setForm(formularioInicial)
      asignarCv(null)
    } catch (err) {
      setErrorCv(err instanceof Error ? err.message : 'No se pudo enviar la postulación')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="pagina-trabaja">
        <MetaPagina title="Trabaja con nosotros" description={paginaTrabaja.seoDescripcion} />
        <section className="section section--suave">
          <div className="container">
            <div className="formulario-exito panel-vidrio" role="status">
              <div className="formulario-exito__icono" aria-hidden="true">
                ✓
              </div>
              <h2 className="formulario-exito__titulo">¡Hoja de vida recibida!</h2>
              <p className="formulario-exito__texto">
                Recibimos tu postulación. El equipo de Recursos Humanos revisará tu perfil y te
                contactará si coincide con nuestras vacantes.
              </p>
              <div className="formulario-exito__acciones">
                <Boton variant="gradient" onClick={() => setEnviado(false)}>
                  Enviar otra hoja de vida
                </Boton>
                <Boton to="/" variant="outline">
                  Ir al inicio
                </Boton>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="pagina-trabaja">
      <MetaPagina title="Trabaja con nosotros" description={paginaTrabaja.seoDescripcion} />

      <section className="hero-editorial hero-trabaja hero-trabaja--solo">
        <div className="container">
          <div className="hero-editorial__texto hero-trabaja__texto hero-servicios__texto panel-vidrio">
            <p className="etiqueta-seccion">{hero.etiqueta}</p>
            <h1>
              {hero.tituloAntes}
              <em>{hero.tituloDestacado}</em>
              {hero.tituloDespues}
            </h1>
            <p>{hero.parrafo}</p>
            <div className="hero-trabaja__acciones hero-servicios__acciones">
              <Boton variant="gradient" onClick={() => irA(hero.botonVacantes.enlace)}>
                {hero.botonVacantes.texto}
              </Boton>
              <Boton variant="ghost" onClick={() => irA(hero.botonPostular.enlace)}>
                {hero.botonPostular.texto}
              </Boton>
            </div>
          </div>
        </div>
      </section>

      <section id="vacantes" className="section section--suave">
        <div className="container">
          <TituloSeccion title={vacantes.titulo} subtitle={vacantes.subtitulo} />

          {banner.activo ? (
            <figure className="vacantes-banner vacantes-banner--publico vacantes-banner--contain">
              <span
                className={`vacantes-banner__badge ${banner.imageDataUrl ? 'vacantes-banner__badge--activo' : ''}`}
              >
                Vacantes abiertas
              </span>

              {banner.imageDataUrl ? (
                <button
                  type="button"
                  className="vacantes-banner__zoom"
                  onClick={() => setLightboxAbierto(true)}
                  aria-label="Ampliar afiche de vacantes"
                >
                  <img
                    src={banner.imageDataUrl}
                    alt={banner.titulo}
                    className="vacantes-banner__img"
                  />
                  <span className="vacantes-banner__zoom-hint">Clic para ampliar</span>
                </button>
              ) : (
                <div className="vacantes-banner__placeholder">
                  <span>Próximamente publicaremos el afiche de vacantes</span>
                </div>
              )}

              <figcaption className="vacantes-banner__overlay">
                <h3>{banner.titulo}</h3>
                {banner.subtitulo && <p>{banner.subtitulo}</p>}
                <button type="button" className="vacantes-banner__cta" onClick={() => irA('#postulacion')}>
                  Enviar hoja de vida →
                </button>
              </figcaption>
            </figure>
          ) : (
            <div className="vacantes-banner vacantes-banner--sin-vacantes">
              <span className="vacantes-banner__badge vacantes-banner__badge--inactivo">
                Sin vacantes publicadas
              </span>
              <h3>{vacantes.sinVacantesTitulo}</h3>
              <p>{vacantes.sinVacantesTexto}</p>
              <button type="button" className="vacantes-banner__cta" onClick={() => irA('#postulacion')}>
                Enviar hoja de vida →
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="postulacion" className="section">
        <div className="container">
          <div className="trabaja-formulario panel-vidrio">
            <TituloSeccion
              title={formulario.titulo}
              subtitle={`${formulario.subtitulo} (${emailRRHH})`}
            />
            <p className="trabaja-formulario__privacidad">{formulario.notaPrivacidad}</p>

            <form className="form form--contacto form--trabaja" onSubmit={manejarEnvio}>
              <div
                className={`cv-upload-zone ${cv ? 'cv-upload-zone--con-archivo' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={manejarDrop}
              >
                <input
                  ref={inputCvRef}
                  id="cv-input"
                  type="file"
                  accept={ARCHIVOS_CV}
                  aria-required="true"
                  className="cv-upload-zone__input"
                  onChange={(e) => asignarCv(e.target.files?.[0] ?? null)}
                />
                <label htmlFor="cv-input" className="cv-upload-zone__label">
                  {cv ? (
                    <>
                      <span className="cv-upload-zone__icono" aria-hidden="true">
                        📄
                      </span>
                      <strong>{cv.name}</strong>
                      <span className="cv-upload-zone__hint">Clic para cambiar archivo</span>
                    </>
                  ) : (
                    <>
                      <span className="cv-upload-zone__icono" aria-hidden="true">
                        ↑
                      </span>
                      <strong>Arrastra tu hoja de vida aquí</strong>
                      <span className="cv-upload-zone__hint">
                        PDF o Word · máx. {MAX_CV_MB} MB
                      </span>
                    </>
                  )}
                </label>
              </div>
              {errorCv && <p className="form__error">{errorCv}</p>}

              <div className="form__row">
                <label>
                  Nombre completo *
                  <input name="name" required value={form.name} onChange={manejarCambio} />
                </label>
                <label>
                  Correo electrónico *
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={manejarCambio}
                  />
                </label>
              </div>
              <div className="form__row">
                <label>
                  Teléfono *
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={manejarCambio}
                  />
                </label>
                <label>
                  Ciudad *
                  <input name="city" required value={form.city} onChange={manejarCambio} />
                </label>
              </div>
              <div className="form__row">
                <label>
                  Área de interés *
                  <select name="area" required value={form.area} onChange={manejarCambio}>
                    <option value="">Seleccionar área</option>
                    {areas.items.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                    <option value="otro">Otra área</option>
                  </select>
                </label>
                <label>
                  Años de experiencia
                  <input
                    name="experience"
                    placeholder="Ej: 2 años"
                    value={form.experience}
                    onChange={manejarCambio}
                  />
                </label>
              </div>
              <label>
                Mensaje opcional
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Cuéntanos brevemente tu experiencia o interés..."
                  value={form.message}
                  onChange={manejarCambio}
                />
              </label>

              <Boton
                type="submit"
                variant="gradient"
                className="form--contacto__enviar"
                disabled={enviando}
              >
                {enviando ? 'Enviando postulación…' : 'Enviar hoja de vida →'}
              </Boton>
            </form>
          </div>
        </div>
      </section>

      <section className="section section--suave">
        <div className="container">
          <TituloSeccion title={proceso.titulo} subtitle={proceso.subtitulo} />
          <div className="servicios-proceso trabaja-proceso">
            {proceso.pasos.map((paso, i) => (
              <article key={paso.id} className="servicios-proceso__paso">
                <span
                  className={`servicios-proceso__linea servicios-proceso__linea--${ACENTOS[i % ACENTOS.length]}`}
                  aria-hidden="true"
                />
                <span className="servicios-proceso__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{paso.titulo}</h3>
                <p>{paso.texto}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <TituloSeccion title={faq.titulo} />
          <div className="trabaja-faq">
            {faq.items.map((item) => (
              <details key={item.id} className="trabaja-faq__item">
                <summary>{item.pregunta}</summary>
                <p>{item.respuesta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {lightboxAbierto && banner.imageDataUrl && (
        <div
          className="trabaja-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Afiche de vacantes ampliado"
          onClick={() => setLightboxAbierto(false)}
        >
          <button
            type="button"
            className="trabaja-lightbox__cerrar"
            onClick={() => setLightboxAbierto(false)}
            aria-label="Cerrar"
          >
            ×
          </button>
          <img
            src={banner.imageDataUrl}
            alt={banner.titulo}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
