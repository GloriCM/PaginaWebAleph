import 'dotenv/config'

export const config = {
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-cambiar-en-produccion',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  corsOrigins: (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  emailRRHH: process.env.EMAIL_RRHH ?? 'gestionhumana@grupoelliot.com',
  emailServicioCliente:
    process.env.EMAIL_SERVICIO_CLIENTE ?? 'servicioalcliente@grupoelliot.com',
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ?? '',
    pass: process.env.SMTP_PASS ?? '',
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER ?? '',
    fromName: process.env.SMTP_FROM_NAME ?? '',
  },
}

export function smtpConfigurado() {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass)
}
