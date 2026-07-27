import nodemailer from 'nodemailer'
import { config, smtpConfigurado } from '../config.js'

interface AdjuntoCorreo {
  filename?: string
  content?: Buffer
  contentType?: string
}

export function smtpDisponible(): boolean {
  if (!smtpConfigurado()) {
    console.warn(
      '[email] SMTP no configurado. Solicitud guardada en BD; configure SMTP_HOST, SMTP_USER y SMTP_PASS en server/.env',
    )
    return false
  }
  return true
}

export function crearTransporter() {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  })
}

export function remitenteFormateado() {
  return config.smtp.fromName
    ? `"${config.smtp.fromName}" <${config.smtp.from}>`
    : config.smtp.from
}

export function adjuntoDesdeDataUrl(dataUrl: string, nombreArchivo: string): AdjuntoCorreo | null {
  const coincidencia = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!coincidencia) return null

  return {
    filename: nombreArchivo,
    content: Buffer.from(coincidencia[2], 'base64'),
    contentType: coincidencia[1],
  }
}

interface OpcionesEnvio {
  to: string
  replyTo: string
  subject: string
  text: string
  html: string
  attachments?: AdjuntoCorreo[]
}

export async function enviarCorreoAleph(opciones: OpcionesEnvio): Promise<boolean> {
  if (!smtpDisponible()) return false

  const transporter = crearTransporter()
  await transporter.sendMail({
    from: remitenteFormateado(),
    to: opciones.to,
    replyTo: opciones.replyTo,
    subject: opciones.subject,
    text: opciones.text,
    html: opciones.html,
    attachments: opciones.attachments,
  })

  return true
}
