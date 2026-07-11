/**
 * @file PaginaContacto.tsx
 * @description Página de contacto con información corporativa, mapa embebido
 * y formulario para enviar mensajes. Persiste las solicitudes localmente.
 * Implementa los requisitos funcionales RF-006 (formulario de contacto) y RF-014 (mapa).
 * @module paginas/PaginaContacto
 */

import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { TituloSeccion, Boton } from '../componentes/interfaz/Boton'
import { guardarSolicitud } from '../datos/solicitudes'
import { configuracionSitio } from '../datos/configuracionSitio'

/** Estado inicial vacío del formulario de contacto. */
const formularioInicial = {
  name: '',
  company: '',
  role: '',
  email: '',
  phone: '',
  city: '',
  message: '',
}

/**
 * Renderiza la página de contacto con datos de la empresa y formulario de mensaje.
 * @returns Elemento JSX con información de contacto y formulario interactivo.
 */
export function PaginaContacto() {
  const [form, setForm] = useState(formularioInicial)
  const [submitted, setSubmitted] = useState(false)

  /**
   * Actualiza un campo del formulario al escribir en un input o textarea.
   * @param e - Evento de cambio del campo de formulario.
   */
  function manejarCambio(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  /**
   * Envía el formulario de contacto y guarda la solicitud en almacenamiento local.
   * @param e - Evento de envío del formulario.
   */
  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    guardarSolicitud({ ...form, type: 'contact' })
    setSubmitted(true)
    setForm(formularioInicial)
  }

  return (
    <>
      <MetaPagina title="Contacto" description="Envíanos tu mensaje y te responderemos pronto." />

      <section className="section">
        <div className="container">
          <div className="panel-vidrio contact-page">
            <div className="contact-page__info">
              <TituloSeccion title="Información de contacto" align="left" />
              <ul className="contact-list">
                <li><strong>Dirección:</strong> {configuracionSitio.address}</li>
                <li><strong>Teléfono:</strong> <a href={`tel:${configuracionSitio.phone}`}>{configuracionSitio.phone}</a></li>
                <li><strong>Email:</strong> <a href={`mailto:${configuracionSitio.email}`}>{configuracionSitio.email}</a></li>
              </ul>
              <div className="map-embed">
                <iframe
                  title="Ubicación de Aleph Impresores"
                  src={configuracionSitio.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="contact-page__form">
              <TituloSeccion title="Envíanos un mensaje" align="left" />
              {submitted ? (
                <div className="form-success form-success--premium" role="status">
                  <div className="form-success__dots" aria-hidden="true">
                    <span className="dot dot--c" />
                    <span className="dot dot--m" />
                    <span className="dot dot--y" />
                    <span className="dot dot--k" />
                  </div>
                  <h3>¡Mensaje enviado!</h3>
                  <p>Recibimos tu consulta. El equipo de Aleph te contactará a la brevedad.</p>
                  <div className="form-success__acciones">
                    <Boton onClick={() => setSubmitted(false)} className="form--contacto__enviar">
                      Enviar otro mensaje
                    </Boton>
                    <Link to="/" className="form-success__inicio">
                      Ir al inicio
                    </Link>
                  </div>
                </div>
              ) : (
                <form className="form form--contacto" onSubmit={manejarEnvio}>
                  <div className="form__row">
                    <label>
                      Nombre *
                      <input name="name" required value={form.name} onChange={manejarCambio} />
                    </label>
                    <label>
                      Empresa
                      <input name="company" value={form.company} onChange={manejarCambio} />
                    </label>
                  </div>
                  <div className="form__row">
                    <label>
                      Cargo
                      <input name="role" value={form.role} onChange={manejarCambio} />
                    </label>
                    <label>
                      Correo *
                      <input name="email" type="email" required value={form.email} onChange={manejarCambio} />
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
                  <label>
                    Mensaje *
                    <textarea name="message" required rows={5} value={form.message} onChange={manejarCambio} />
                  </label>
                  <Boton type="submit" className="form--contacto__enviar">
                    Enviar mensaje
                  </Boton>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
