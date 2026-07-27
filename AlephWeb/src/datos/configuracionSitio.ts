/**
 * @file configuracionSitio.ts
 * @description Configuración global del sitio web: contacto, redes sociales, SEO y mapa.
 * Modificar este archivo para actualizar datos corporativos sin tocar componentes.
 * @module datos/configuracionSitio
 */

/**
 * Objeto de configuración principal del sitio.
 * Incluye información de contacto, enlaces sociales y metadatos SEO (RNF-006).
 */
export const configuracionSitio = {
  /** Nombre comercial de la empresa. */
  name: 'Aleph Impresores',
  /** Eslogan o frase principal. */
  tagline: 'Soluciones gráficas de alto impacto',
  /** Descripción general para SEO y presentación. */
  description:
    'Empresa líder en artes gráficas, empaques y material POP. Más de 20 años transformando ideas en productos de calidad.',
  /** Teléfono de contacto con código de país. */
  phone: '+57 300 123 4567',
  /** Número de WhatsApp sin símbolos (RF-016). */
  whatsapp: '573001234567',
  /** Correo electrónico corporativo. */
  email: 'contacto@alephimpresores.com',
  /** Correo de Recursos Humanos — destino de hojas de vida (RF postulaciones). */
  emailRRHH: 'gestionhumana@grupoelliot.com',
  /** Correo de servicio al cliente — destino de contacto y cotizaciones. */
  emailServicioCliente: 'servicioalcliente@grupoelliot.com',
  /** Dirección física de la empresa (RF-014). */
  address: 'Graficas Elliot SAS, Cra. 1 #43-76, COMUNA 4, Cali, Valle del Cauca',
  /** Horario de atención. */
  horarios: [
    'Lunes a viernes: 8:00 a. m. – 5:30 p. m.',
    'Sábados: 8:00 a. m. – 12:00 m.',
    'Domingos y festivos: cerrado',
  ],
  /** Ruta del catálogo PDF descargable (RF-017). */
  catalogUrl: '/catalogo-aleph.pdf',
  /** Enlaces a redes sociales oficiales (RF-015). */
  social: {
    facebook: 'https://facebook.com/alephimpresores',
    instagram: 'https://instagram.com/alephimpresores',
    linkedin: 'https://linkedin.com/company/alephimpresores',
    youtube: 'https://youtube.com/@alephimpresores',
  },
  /** URL embebida de Google Maps para mostrar ubicación. */
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8!2d-74.072!3d4.711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDInNDAuMCJOIDc0wrAwNCcxOS4yIlc!5e0!3m2!1ses!2sco!4v1',
  /** Configuración de optimización para buscadores. */
  seo: {
    defaultTitle: 'Aleph Impresores | Artes Gráficas y Empaques',
    defaultDescription:
      'Soluciones en plegadizas, bolsas, exhibidores, empaques especiales y material POP. Cotiza tu proyecto con Aleph Impresores.',
    keywords:
      'artes gráficas, empaques, plegadizas, bolsas, exhibidores, material POP, impresión offset, Colombia',
  },
}
