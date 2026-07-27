import { config } from '../config.js'
import { enviarCorreoAleph } from './emailEnvio.js'
import {
  generarHtmlCorreoAleph,
  generarTextoPlano,
  seccionContacto,
  type SeccionCorreo,
} from './emailPlantilla.js'

interface DatosSolicitudCorreo {
  name: string
  email: string
  phone?: string | null
  city?: string | null
  company?: string | null
  role?: string | null
  message?: string | null
  quoteData?: {
    product?: string
    quantity?: string
    width?: string
    length?: string
    material?: string
    notes?: string
  } | null
}

async function enviarCorreoSolicitud(
  tipo: 'contact' | 'quote',
  datos: DatosSolicitudCorreo,
): Promise<boolean> {
  const mensaje = datos.message?.trim() || '—'
  const secciones: SeccionCorreo[] = [seccionContacto(datos)]

  let subject: string
  let titulo: string
  let subtitulo: string

  if (tipo === 'contact') {
    subject = `Mensaje de contacto — ${datos.name}`
    titulo = `Nuevo mensaje de ${datos.name}`
    subtitulo = 'Alguien escribió desde el formulario de contacto del sitio web.'
    secciones.push({
      titulo: 'Mensaje',
      campos: [{ etiqueta: 'Contenido', valor: mensaje, anchoCompleto: true }],
    })
  } else {
    const quote = datos.quoteData ?? {}
    subject = `Solicitud de cotización — ${datos.name} (${quote.product ?? 'proyecto'})`
    titulo = `Cotización: ${quote.product ?? 'Nuevo proyecto'}`
    subtitulo = `${datos.name} solicitó una propuesta personalizada desde la web.`
    secciones.push({
      titulo: 'Detalle del proyecto',
      campos: [
        { etiqueta: 'Producto', valor: quote.product },
        { etiqueta: 'Cantidad', valor: quote.quantity },
        { etiqueta: 'Ancho', valor: quote.width },
        { etiqueta: 'Largo', valor: quote.length },
        { etiqueta: 'Material', valor: quote.material },
        { etiqueta: 'Notas del proyecto', valor: quote.notes, anchoCompleto: true },
        { etiqueta: 'Mensaje adicional', valor: mensaje, anchoCompleto: true },
      ],
    })
  }

  const textoIntro =
    tipo === 'contact'
      ? 'Nuevo mensaje recibido desde el formulario de contacto de Aleph Impresores.\n\n'
      : 'Nueva solicitud de cotización recibida desde la web de Aleph Impresores.\n\n'

  return enviarCorreoAleph({
    to: config.emailServicioCliente,
    replyTo: datos.email,
    subject,
    text: textoIntro + generarTextoPlano(secciones),
    html: generarHtmlCorreoAleph({
      tipo,
      titulo,
      subtitulo,
      secciones,
      emailCliente: datos.email,
      nombreCliente: datos.name,
    }),
  })
}

export function enviarCorreoContactoCliente(datos: DatosSolicitudCorreo) {
  return enviarCorreoSolicitud('contact', datos)
}

export function enviarCorreoCotizacionCliente(datos: DatosSolicitudCorreo) {
  return enviarCorreoSolicitud('quote', datos)
}
