/**
 * @file PaginaTrabajaConNosotros.tsx
 * @description Sección «Trabaja con nosotros»: vacantes de RRHH y envío de hoja de vida.
 */

import { useEffect, useState, type DragEvent, type FormEvent } from 'react'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton, TituloSeccion } from '../componentes/interfaz/Boton'
import { SeccionPagina } from '../componentes/interfaz/SeccionPagina'
import { configuracionSitio } from '../datos/configuracionSitio'
import { enviarPostulacionRRHH } from '../datos/postulacionesRRHH'
import {
  areasTrabajo,
  pasosSeleccion,
} from '../datos/trabajaConNosotros'
import {
  EVENTO_BANNER_VACANTES,
  obtenerBannerVacantes,
  type BannerVacantesRRHH,
} from '../datos/vacantesRRHH'

const ARCHIVOS_CV = '.pdf,.doc,.docx'
const MAX_CV_MB = 5

const formularioInicial = {
  name: '',
  email: '',
  phone: '',
  city: '',
  area: '',
  experience: '',
  message: '',
}

export function PaginaTrabajaConNosotros() {
  const [banner, setBanner] = useState<BannerVacantesRRHH>(() => obtenerBannerVacantes())
  const [form, setForm] = useState(formularioInicial)
  const [cv, setCv] = useState<File | null>(null)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorCv, setErrorCv] = useState('')

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
      return
    }
    setCv(archivo)
  }

  function manejarDrop(e: DragEvent) {
    e.preventDefault()
    asignarCv(e.dataTransfer.files?.[0] ?? null)
  }

  function irAlFormulario() {
    document.getElementById('postulacion')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    if (!validarArchivo(cv) || !cv) return

    setEnviando(true)
    const areaLabel =
      form.area === 'otro'
        ? 'Otra área'
        : (areasTrabajo.find((a) => a.id === form.area)?.name ?? form.area)

    try {
      await enviarPostulacionRRHH({ ...form, areaLabel, cv })
      setEnviado(true)
      setForm(formularioInicial)
      setCv(null)
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <>
        <MetaPagina
          title="Trabaja con nosotros"
          description="Únete al equipo de Aleph Impresores."
        />
        <SeccionPagina
          className="pagina-seccion--hero pagina-seccion--formulario-exito"
          panelClassName="pagina-seccion__panel--formulario"
        >
          <div className="formulario-exito" role="status">
            <div className="formulario-exito__icono" aria-hidden="true">✓</div>
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
        </SeccionPagina>
      </>
    )
  }

  return (
    <>
      <MetaPagina
        title="Trabaja con nosotros"
        description="Vacantes disponibles y envío de hoja de vida a Recursos Humanos — Aleph Impresores."
      />

      <SeccionPagina className="pagina-seccion--hero">
        <h1 className="pagina-seccion__titulo">Trabaja con nosotros</h1>
        <p className="pagina-seccion__texto">
          Únete a un equipo que combina precisión industrial y creatividad gráfica. Consulta
          nuestras vacantes y envía tu hoja de vida a Recursos Humanos.
        </p>
      </SeccionPagina>

      <SeccionPagina>
        <TituloSeccion
          title="Vacantes disponibles"
          subtitle="Publicación actualizada por Recursos Humanos"
        />

        {banner.activo ? (
          <figure className="vacantes-banner vacantes-banner--publico">
            {banner.imageDataUrl ? (
              <img
                src={banner.imageDataUrl}
                alt={banner.titulo}
                className="vacantes-banner__img"
              />
            ) : (
              <div className="vacantes-banner__placeholder">
                <span>Próximamente publicaremos el afiche de vacantes</span>
              </div>
            )}
            <figcaption className="vacantes-banner__overlay">
              <h3>{banner.titulo}</h3>
              {banner.subtitulo && <p>{banner.subtitulo}</p>}
              <button type="button" className="vacantes-banner__cta" onClick={irAlFormulario}>
                Enviar hoja de vida →
              </button>
            </figcaption>
          </figure>
        ) : (
          <div className="vacantes-banner vacantes-banner--sin-vacantes">
            <p>
              En este momento no hay vacantes publicadas. Aun así puedes dejarnos tu hoja de
              vida y te tendremos en cuenta para futuras oportunidades.
            </p>
            <button type="button" className="vacantes-banner__cta" onClick={irAlFormulario}>
              Enviar hoja de vida →
            </button>
          </div>
        )}
      </SeccionPagina>

      <SeccionPagina id="postulacion" panelClassName="pagina-seccion__panel--formulario">
        <TituloSeccion
          title="Envía tu hoja de vida"
          subtitle={`Será revisada por Recursos Humanos (${configuracionSitio.emailRRHH})`}
        />

        <form className="form form--contacto form--trabaja" onSubmit={manejarEnvio}>
          <div
            className={`cv-upload-zone ${cv ? 'cv-upload-zone--con-archivo' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={manejarDrop}
          >
            <input
              id="cv-input"
              type="file"
              accept={ARCHIVOS_CV}
              required
              className="cv-upload-zone__input"
              onChange={(e) => asignarCv(e.target.files?.[0] ?? null)}
            />
            <label htmlFor="cv-input" className="cv-upload-zone__label">
              {cv ? (
                <>
                  <span className="cv-upload-zone__icono" aria-hidden="true">📄</span>
                  <strong>{cv.name}</strong>
                  <span className="cv-upload-zone__hint">Clic para cambiar archivo</span>
                </>
              ) : (
                <>
                  <span className="cv-upload-zone__icono" aria-hidden="true">↑</span>
                  <strong>Arrastra tu hoja de vida aquí</strong>
                  <span className="cv-upload-zone__hint">PDF o Word · máx. {MAX_CV_MB} MB</span>
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
              <input name="phone" type="tel" required value={form.phone} onChange={manejarCambio} />
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
                {areasTrabajo.map((area) => (
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
      </SeccionPagina>

      <SeccionPagina>
        <TituloSeccion title="Proceso de selección" />
        <ol className="proceso-seleccion">
          {pasosSeleccion.map((paso, i) => (
            <li key={paso} className="proceso-seleccion__paso">
              <span className="proceso-seleccion__numero">{i + 1}</span>
              <span className="proceso-seleccion__texto">{paso}</span>
            </li>
          ))}
        </ol>
      </SeccionPagina>
    </>
  )
}
