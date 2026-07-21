/**
 * @file postulacionesRRHH.ts
 * @description Registro de postulaciones laborales para Recursos Humanos.
 */

import { configuracionSitio } from './configuracionSitio'
import { guardarSolicitud } from './solicitudes'
import { archivoABase64 } from './vacantesRRHH'

export interface DatosPostulacionRRHH {
  name: string
  email: string
  phone: string
  city: string
  area: string
  areaLabel: string
  experience: string
  message: string
  cv: File
}

/** Registra la postulación con hoja de vida adjunta para revisión de RRHH. */
export async function enviarPostulacionRRHH(datos: DatosPostulacionRRHH) {
  const cvDataUrl = await archivoABase64(datos.cv)
  const emailDestino = configuracionSitio.emailRRHH

  guardarSolicitud({
    name: datos.name,
    email: datos.email,
    phone: datos.phone,
    city: datos.city,
    company: '',
    role: datos.areaLabel,
    message: datos.message || `Postulación — área: ${datos.areaLabel}`,
    type: 'job',
    jobData: {
      area: datos.area,
      areaLabel: datos.areaLabel,
      experience: datos.experience,
      cvFileName: datos.cv.name,
      cvDataUrl,
      emailEnviadoA: emailDestino,
    },
  })

  return { ok: true as const, emailDestino }
}
