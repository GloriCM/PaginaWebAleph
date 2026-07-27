import { config } from '../config.js'
import { adjuntoDesdeDataUrl, enviarCorreoAleph } from './emailEnvio.js'
import {
  generarHtmlCorreoAleph,
  generarTextoPlano,
  seccionContacto,
  type SeccionCorreo,
} from './emailPlantilla.js'

interface DatosPostulacionCorreo {
  name: string
  email: string
  phone?: string | null
  city?: string | null
  role?: string | null
  message?: string | null
  jobData?: {
    area?: string
    areaLabel?: string
    experience?: string
    cvFileName?: string
    cvDataUrl?: string
  } | null
}

export async function enviarCorreoPostulacionRRHH(datos: DatosPostulacionCorreo): Promise<boolean> {
  const job = datos.jobData ?? {}
  const area = job.areaLabel ?? job.area ?? datos.role ?? '—'
  const experiencia = job.experience?.trim() || '—'
  const mensaje = datos.message?.trim() || '—'

  const adjuntos = []
  if (job.cvDataUrl && job.cvFileName) {
    const adjunto = adjuntoDesdeDataUrl(job.cvDataUrl, job.cvFileName)
    if (adjunto) adjuntos.push(adjunto)
  }

  const secciones: SeccionCorreo[] = [
    seccionContacto(datos),
    {
      titulo: 'Información de la postulación',
      campos: [
        { etiqueta: 'Área de interés', valor: area },
        { etiqueta: 'Años de experiencia', valor: experiencia },
        { etiqueta: 'Mensaje del candidato', valor: mensaje, anchoCompleto: true },
        {
          etiqueta: 'Hoja de vida',
          valor: job.cvFileName ? `${job.cvFileName} (adjunta en este correo)` : 'Sin archivo adjunto',
        },
      ],
    },
  ]

  const notaPie = job.cvFileName
    ? 'La hoja de vida del candidato viene adjunta a este correo.'
    : 'El candidato no adjuntó hoja de vida en el formulario.'

  return enviarCorreoAleph({
    to: config.emailRRHH,
    replyTo: datos.email,
    subject: `Postulación laboral — ${datos.name} (${area})`,
    text: [
      'Nueva hoja de vida recibida desde la web de Aleph Impresores.',
      '',
      generarTextoPlano(secciones, notaPie),
    ].join('\n'),
    html: generarHtmlCorreoAleph({
      tipo: 'job',
      titulo: `Postulación de ${datos.name}`,
      subtitulo: `Interés en el área de ${area}. Revisa el perfil y responde al candidato.`,
      secciones,
      emailCliente: datos.email,
      nombreCliente: datos.name,
      notaPie,
    }),
    attachments: adjuntos,
  })
}
