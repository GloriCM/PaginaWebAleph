/**
 * @file PaginaCotizacion.tsx
 * @description Formulario de cotización en 3 pasos con diseño glassmorphism.
 * Implementa RF-007 con flujo guiado: proyecto → contacto → confirmación.
 * @module paginas/PaginaCotizacion
 */

import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MetaPagina } from '../componentes/interfaz/MetaPagina'
import { Boton, TituloSeccion } from '../componentes/interfaz/Boton'
import { SeccionPagina } from '../componentes/interfaz/SeccionPagina'
import { guardarSolicitud } from '../datos/solicitudes'
import { useProductos } from '../hooks/useProductos'

/** Extensiones de archivo aceptadas para adjuntos. */
const ARCHIVOS_ACEPTADOS = '.pdf,.ai,.cdr,.jpg,.jpeg,.png'

/** Etiquetas de los pasos del formulario multipaso. */
const PASOS = ['Proyecto', 'Contacto', 'Enviar']

/**
 * Página de solicitud de cotización con stepper visual de tres pasos.
 */
export function PaginaCotizacion() {
  const productos = useProductos()
  const [searchParams] = useSearchParams()
  const preseleccionado = searchParams.get('producto') ?? ''
  const productoPreseleccionado = productos.find((p) => p.slug === preseleccionado)

  const [paso, setPaso] = useState(1)
  const [form, setForm] = useState({
    product: productoPreseleccionado?.name ?? '',
    quantity: '',
    width: '',
    length: '',
    material: '',
    notes: '',
  })
  const [archivo, setArchivo] = useState<File | null>(null)
  const [enviado, setEnviado] = useState(false)
  const [contacto, setContacto] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    city: '',
    message: '',
  })

  function manejarCambio(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function manejarCambioContacto(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setContacto((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function manejarEnvio(e: FormEvent) {
    e.preventDefault()
    guardarSolicitud({
      ...contacto,
      message: contacto.message || `Cotización: ${form.product}`,
      type: 'quote',
      quoteData: form,
    })
    setEnviado(true)
  }

  return (
    <>
      <MetaPagina
        title="Solicitar cotización"
        description="Solicita una cotización personalizada para tu proyecto de empaque o impresión."
      />

      {enviado ? (
        <SeccionPagina
          className="pagina-seccion--hero pagina-seccion--cotizacion pagina-seccion--formulario-exito"
          panelClassName="pagina-seccion__panel--formulario"
        >
          <div className="formulario-exito" role="status">
            <div className="formulario-exito__icono" aria-hidden="true">✓</div>
            <h2 className="formulario-exito__titulo">¡Solicitud enviada!</h2>
            <p className="formulario-exito__texto">
              Hemos recibido tu solicitud. Nuestro equipo se pondrá en contacto contigo pronto.
            </p>
            <div className="formulario-exito__acciones">
              <Boton to="/productos" variant="gradient">
                Ver más productos
              </Boton>
              <Boton to="/" variant="outline">
                Ir al inicio
              </Boton>
            </div>
          </div>
        </SeccionPagina>
      ) : (
        <>
          <SeccionPagina className="pagina-seccion--hero pagina-seccion--cotizacion">
            <h1 className="pagina-seccion__titulo">Solicitar cotización</h1>
            <p className="pagina-seccion__texto">
              Cuéntanos tu proyecto en tres pasos y te respondemos con una propuesta a medida.
            </p>
          </SeccionPagina>

          <SeccionPagina panelClassName="pagina-seccion__panel--cotizacion">
            <div className="stepper" aria-label="Progreso del formulario">
              {PASOS.map((etiqueta, i) => (
                <div
                  key={etiqueta}
                  className={`stepper__paso ${paso > i ? 'stepper__paso--completo' : ''} ${paso === i + 1 ? 'stepper__paso--activo' : ''}`}
                >
                  <span className="stepper__numero">{i + 1}</span>
                  <span className="stepper__etiqueta">{etiqueta}</span>
                </div>
              ))}
            </div>

            <form className="form form--contacto" onSubmit={manejarEnvio}>
              {paso === 1 && (
                <>
                  <TituloSeccion title="Cuéntanos sobre tu proyecto" />
                  <div className="form__row">
                    <label>
                      Producto de interés *
                      <select name="product" required value={form.product} onChange={manejarCambio}>
                        <option value="">Seleccionar producto</option>
                        {productos.map((p) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                        <option value="Otro">Otro producto</option>
                      </select>
                    </label>
                    <label>
                      Cantidad aproximada *
                      <input name="quantity" required placeholder="Ej: 500 unidades" value={form.quantity} onChange={manejarCambio} />
                    </label>
                  </div>
                  <div className="form__row">
                    <label>
                      Ancho
                      <input name="width" placeholder="Ej: 20 cm" value={form.width} onChange={manejarCambio} />
                    </label>
                    <label>
                      Largo
                      <input name="length" placeholder="Ej: 15 cm" value={form.length} onChange={manejarCambio} />
                    </label>
                  </div>
                  <label>
                    Material requerido
                    <input name="material" placeholder="Ej: Cartulina SBS 300g" value={form.material} onChange={manejarCambio} />
                  </label>
                  <label>
                    Visión y detalles del proyecto
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Describe el tacto, los colores y el impacto que deseas lograr..."
                      value={form.notes}
                      onChange={manejarCambio}
                    />
                  </label>
                  <label>
                    Adjuntar archivo (PDF, AI, CDR, JPG, PNG)
                    <input type="file" accept={ARCHIVOS_ACEPTADOS} onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
                    {archivo && <span className="form__file-name">{archivo.name}</span>}
                  </label>
                  <div className="formulario-vidrio__acciones">
                    <Boton type="button" variant="gradient" onClick={() => setPaso(2)}>
                      Continuar →
                    </Boton>
                  </div>
                </>
              )}

              {paso === 2 && (
                <>
                  <TituloSeccion title="Datos de contacto" />
                  <div className="form__row">
                    <label>
                      Tu nombre *
                      <input name="name" required placeholder="Nombre completo" value={contacto.name} onChange={manejarCambioContacto} />
                    </label>
                    <label>
                      Empresa
                      <input name="company" value={contacto.company} onChange={manejarCambioContacto} />
                    </label>
                  </div>
                  <div className="form__row">
                    <label>
                      Correo electrónico *
                      <input name="email" type="email" required placeholder="correo@empresa.com" value={contacto.email} onChange={manejarCambioContacto} />
                    </label>
                    <label>
                      Teléfono *
                      <input name="phone" type="tel" required value={contacto.phone} onChange={manejarCambioContacto} />
                    </label>
                  </div>
                  <label>
                    Ciudad *
                    <input name="city" required value={contacto.city} onChange={manejarCambioContacto} />
                  </label>
                  <div className="formulario-vidrio__acciones">
                    <Boton type="button" variant="outline" onClick={() => setPaso(1)}>← Atrás</Boton>
                    <Boton type="button" variant="gradient" onClick={() => setPaso(3)}>Revisar →</Boton>
                  </div>
                </>
              )}

              {paso === 3 && (
                <>
                  <TituloSeccion title="Confirmar solicitud" />
                  <div className="resumen-cotizacion">
                    <p><strong>Producto:</strong> {form.product}</p>
                    <p><strong>Cantidad:</strong> {form.quantity}</p>
                    {form.width && <p><strong>Ancho:</strong> {form.width}</p>}
                    {form.length && <p><strong>Largo:</strong> {form.length}</p>}
                    {form.material && <p><strong>Material:</strong> {form.material}</p>}
                    <p><strong>Contacto:</strong> {contacto.name} — {contacto.email}</p>
                    {archivo && <p><strong>Archivo:</strong> {archivo.name}</p>}
                  </div>
                  <div className="formulario-vidrio__acciones">
                    <Boton type="button" variant="outline" onClick={() => setPaso(2)}>← Atrás</Boton>
                    <Boton type="submit" variant="gradient">Enviar solicitud →</Boton>
                  </div>
                </>
              )}
            </form>
          </SeccionPagina>
        </>
      )}
    </>
  )
}
