/** Plantillas HTML compatibles con clientes de correo (Gmail, Outlook, etc.). */

const C = {
  cyan: '#00b4e4',
  cyanDark: '#0090b8',
  magenta: '#e91e8c',
  ink: '#1c1f24',
  gray: '#4f5660',
  grayMid: '#64748b',
  grayLight: '#94a3b8',
  bg: '#eef5f9',
  white: '#ffffff',
  surface: '#f8fafc',
  border: '#cbd5e1',
  yellow: '#ffd400',
} as const

export interface CampoCorreo {
  etiqueta: string
  valor?: string | null
  enlace?: string
  anchoCompleto?: boolean
}

export interface SeccionCorreo {
  titulo: string
  campos: CampoCorreo[]
}

export interface PlantillaCorreoOpciones {
  tipo: 'contact' | 'quote' | 'job'
  titulo: string
  subtitulo: string
  secciones: SeccionCorreo[]
  emailCliente: string
  nombreCliente: string
  notaPie?: string
}

function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function valorMostrar(valor?: string | null): string {
  const limpio = valor?.trim()
  return limpio ? escaparHtml(limpio) : '—'
}

function etiquetaTipo(tipo: PlantillaCorreoOpciones['tipo']): string {
  switch (tipo) {
    case 'contact':
      return 'Mensaje de contacto'
    case 'quote':
      return 'Solicitud de cotización'
    case 'job':
      return 'Postulación laboral'
  }
}

function colorAcentoTipo(tipo: PlantillaCorreoOpciones['tipo']): string {
  switch (tipo) {
    case 'contact':
      return C.cyanDark
    case 'quote':
      return C.magenta
    case 'job':
      return C.ink
  }
}

function filaCampo(campo: CampoCorreo, ultima = false): string {
  const valor = valorMostrar(campo.valor)
  const borde = ultima ? '' : `border-bottom:1px solid ${C.border};`

  const valorHtml = campo.enlace
    ? `<a href="${escaparHtml(campo.enlace)}" style="color:${C.cyanDark};font-weight:700;text-decoration:underline;">${valor}</a>`
    : `<span style="color:${C.ink};font-weight:600;">${valor}</span>`

  if (campo.anchoCompleto) {
    return `
      <tr>
        <td colspan="2" style="padding:16px 0 4px;${borde}">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.grayMid};">
            ${escaparHtml(campo.etiqueta)}
          </p>
          <p style="margin:0;font-size:15px;line-height:1.65;color:${C.ink};">${valor}</p>
        </td>
      </tr>`
  }

  return `
    <tr>
      <td width="130" style="padding:12px 16px 12px 0;font-size:13px;font-weight:600;color:${C.gray};vertical-align:top;${borde}">
        ${escaparHtml(campo.etiqueta)}
      </td>
      <td style="padding:12px 0;font-size:15px;vertical-align:top;${borde}">
        ${valorHtml}
      </td>
    </tr>`
}

function bloqueSeccion(seccion: SeccionCorreo, acento: string): string {
  const camposVisibles = seccion.campos.filter((c) => c.valor?.trim() || c.anchoCompleto)
  const filas = camposVisibles
    .map((campo, i) => filaCampo(campo, i === camposVisibles.length - 1))
    .join('')

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px;">
      <tr>
        <td width="5" bgcolor="${acento}" style="background-color:${acento};font-size:0;line-height:0;">&nbsp;</td>
        <td style="padding-left:12px;">
          <p style="margin:0 0 10px;font-size:13px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:${C.ink};">
            ${escaparHtml(seccion.titulo)}
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.surface}" style="background-color:${C.surface};border:1px solid ${C.border};">
            <tr>
              <td style="padding:6px 20px 10px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${filas}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
}

/** Botón compatible con Gmail/Outlook (sin gradientes). */
function botonResponder(mailto: string, nombre: string): string {
  const texto = `Responder a ${escaparHtml(nombre)}`
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
      <tr>
        <td align="center">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${escaparHtml(mailto)}" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="12%" strokecolor="${C.cyanDark}" fillcolor="${C.cyanDark}">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${texto}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" bgcolor="${C.cyanDark}" style="background-color:${C.cyanDark};border-radius:8px;">
                <a href="${escaparHtml(mailto)}" target="_blank" style="display:inline-block;padding:15px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;line-height:1.2;">
                  ${texto} &rarr;
                </a>
              </td>
            </tr>
          </table>
          <!--<![endif]-->
        </td>
      </tr>
    </table>`
}

function encabezadoHtml(opciones: PlantillaCorreoOpciones, acento: string): string {
  return `
    <tr>
      <td bgcolor="${C.ink}" style="background-color:${C.ink};padding:0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td height="5" bgcolor="${C.cyan}" style="background-color:${C.cyan};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 32px 26px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:700;color:#ffffff;line-height:1;">
                      aleph
                    </p>
                    <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:#cbd5e1;">
                      impresores
                      &nbsp;&nbsp;
                      <span style="color:${C.cyan};">&#9679;</span>
                      <span style="color:${C.magenta};">&#9679;</span>
                      <span style="color:${C.yellow};">&#9679;</span>
                      <span style="color:#ffffff;">&#9679;</span>
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px;">
                <tr>
                  <td bgcolor="${acento}" style="background-color:${acento};padding:7px 14px;border-radius:4px;">
                    <span style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#ffffff;">
                      ${escaparHtml(etiquetaTipo(opciones.tipo))}
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:18px 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;font-weight:700;color:#ffffff;line-height:1.3;">
                ${escaparHtml(opciones.titulo)}
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#cbd5e1;">
                ${escaparHtml(opciones.subtitulo)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

export function generarHtmlCorreoAleph(opciones: PlantillaCorreoOpciones): string {
  const acento = colorAcentoTipo(opciones.tipo)
  const seccionesHtml = opciones.secciones.map((s) => bloqueSeccion(s, acento)).join('')
  const mailto = `mailto:${opciones.emailCliente}?subject=${encodeURIComponent(`Re: ${opciones.titulo}`)}`
  const notaPie = opciones.notaPie
    ? `<p style="margin:16px 0 0;font-size:13px;line-height:1.55;color:${C.grayMid};">${escaparHtml(opciones.notaPie)}</p>`
    : ''

  return `<!DOCTYPE html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${escaparHtml(opciones.titulo)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${C.bg};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.bg}" style="background-color:${C.bg};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" bgcolor="${C.white}" style="width:100%;max-width:600px;background-color:${C.white};border:1px solid ${C.border};">
          ${encabezadoHtml(opciones, acento)}

          <tr>
            <td bgcolor="${C.white}" style="background-color:${C.white};padding:28px 32px 12px;">
              ${seccionesHtml}
              ${botonResponder(mailto, opciones.nombreCliente)}
              ${notaPie}
            </td>
          </tr>

          <tr>
            <td bgcolor="${C.surface}" style="background-color:${C.surface};padding:20px 32px;border-top:1px solid ${C.border};">
              <p style="margin:0 0 8px;font-size:13px;color:${C.gray};">
                <strong style="color:${C.ink};">Aleph Impresores</strong>
                &nbsp;&middot;&nbsp; Soluciones gr&aacute;ficas de alto impacto
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:${C.grayLight};">
                Correo autom&aacute;tico del sitio web. Usa el bot&oacute;n de arriba para responder al cliente.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function generarTextoPlano(secciones: SeccionCorreo[], pie?: string): string {
  const lineas: string[] = []

  for (const seccion of secciones) {
    lineas.push(`--- ${seccion.titulo} ---`)
    for (const campo of seccion.campos) {
      lineas.push(`${campo.etiqueta}: ${campo.valor?.trim() || '—'}`)
    }
    lineas.push('')
  }

  if (pie) lineas.push(pie)
  return lineas.join('\n').trim()
}

export function seccionContacto(datos: {
  name: string
  email: string
  phone?: string | null
  city?: string | null
  company?: string | null
  role?: string | null
}): SeccionCorreo {
  const campos: CampoCorreo[] = [
    { etiqueta: 'Nombre', valor: datos.name },
    { etiqueta: 'Correo', valor: datos.email, enlace: `mailto:${datos.email}` },
    { etiqueta: 'Teléfono', valor: datos.phone, enlace: datos.phone ? `tel:${datos.phone}` : undefined },
    { etiqueta: 'Ciudad', valor: datos.city },
  ]

  if (datos.company?.trim()) campos.push({ etiqueta: 'Empresa', valor: datos.company })
  if (datos.role?.trim()) campos.push({ etiqueta: 'Cargo', valor: datos.role })

  return {
    titulo: 'Datos de contacto',
    campos,
  }
}
