/**
 * @file contenido.ts
 * @description Contenido editorial: galería, noticias, clientes, certificaciones y testimonios.
 * Cubre RF-009, RF-010, RF-011, RF-012 y RF-013.
 * @module datos/contenido
 */

import type {
  ProyectoGaleria,
  Noticia,
  Cliente,
  Certificacion,
  Testimonio,
} from '../tipos/indice'

/** Genera imagen placeholder para contenido editorial. */
const generarImagen = (color: string, text: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect fill="${color}" width="800" height="600"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="28">${text}</text>
    </svg>`,
  )}`

/**
 * Genera una imagen de portafolio con acentos CMYK luminosos (sin fondos oscuros).
 */
const generarImagenGaleria = (c1: string, c2: string, titulo: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="45%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="800" height="560" fill="url(#bg)"/>
      <circle cx="620" cy="120" r="140" fill="#00aeef" opacity="0.12"/>
      <circle cx="140" cy="440" r="110" fill="#c02060" opacity="0.1"/>
      <circle cx="700" cy="420" r="80" fill="#f5c842" opacity="0.14"/>
      <rect x="48" y="48" width="120" height="4" rx="2" fill="#c02060" opacity="0.35"/>
      <text x="48" y="88" fill="#004b4d" font-family="Georgia,serif" font-size="26">${titulo}</text>
      <text x="48" y="500" fill="#7a8f90" font-family="sans-serif" font-size="12" letter-spacing="4">ALEPH IMPRESORES</text>
      <circle cx="720" cy="500" r="7" fill="#00aeef"/>
      <circle cx="742" cy="500" r="7" fill="#c02060"/>
      <circle cx="764" cy="500" r="7" fill="#f5c842"/>
      <circle cx="786" cy="500" r="7" fill="#cccccc"/>
    </svg>`,
  )}`

/** Proyectos destacados de la galería (RF-009). */
export const proyectosGaleria: ProyectoGaleria[] = [
  {
    id: '1',
    name: 'Lanzamiento línea premium',
    productType: 'Empaque especial',
    client: 'Marca de cosmética',
    description: 'Desarrollo integral de empaque con foil y repujado para línea de lanzamiento.',
    image: generarImagenGaleria('#fdf0f6', '#f8e8f0', 'Empaque premium'),
  },
  {
    id: '2',
    name: 'Campaña verano retail',
    productType: 'Exhibidor',
    client: 'Cadena de supermercados',
    description: 'Exhibidores de piso para campaña estacional en 200 puntos de venta.',
    image: generarImagenGaleria('#eef8fc', '#e4f4fa', 'Exhibidor retail'),
  },
  {
    id: '3',
    name: 'Rediseño empaque alimentos',
    productType: 'Plegadiza',
    description: 'Optimización estructural y gráfica de empaque para góndola.',
    image: generarImagenGaleria('#faf6ec', '#f5f0e4', 'Plegadiza'),
  },
  {
    id: '4',
    name: 'Material POP farmacia',
    productType: 'Material POP',
    client: 'Laboratorio farmacéutico',
    description: 'Stoppers, wobblers y glorificadores para cadena nacional.',
    image: generarImagenGaleria('#fdf0f6', '#f5ecf8', 'Material POP'),
  },
  {
    id: '5',
    name: 'Bolsas corporativas',
    productType: 'Bolsa',
    client: 'Tienda de moda',
    description: 'Bolsas kraft premium con asa de algodón para tiendas flagship.',
    image: generarImagenGaleria('#f0f8ee', '#e8f4e4', 'Bolsas kraft'),
  },
  {
    id: '6',
    name: 'Vasos evento deportivo',
    productType: 'Vaso',
    description: 'Producción de 50,000 vasos para evento patrocinado.',
    image: generarImagenGaleria('#eef8fc', '#e8f2f8', 'Vasos promocionales'),
  },
]

/** Noticias y novedades de la empresa (RF-010). */
export const noticias: Noticia[] = [
  {
    id: '1',
    title: 'Aleph Impresores obtiene certificación FSC',
    slug: 'certificacion-fsc',
    excerpt: 'Reafirmamos nuestro compromiso con la sostenibilidad.',
    content:
      'Nos complace anunciar que hemos obtenido la certificación FSC, garantizando que nuestros materiales provienen de fuentes responsables. Este logro refuerza nuestra política ambiental y la confianza de nuestros clientes.',
    image: generarImagen('#4CAF50', 'Noticia 1'),
    date: '2026-03-15',
  },
  {
    id: '2',
    title: 'Nueva línea de empaques compostables',
    slug: 'empaques-compostables',
    excerpt: 'Innovamos con materiales biodegradables para la industria alimentaria.',
    content:
      'Presentamos nuestra nueva línea de empaques compostables, desarrollada en alianza con proveedores internacionales. Estas soluciones mantienen la barrera necesaria para alimentos mientras reducen el impacto ambiental.',
    image: generarImagen('#00AEEF', 'Noticia 2'),
    date: '2026-02-28',
  },
  {
    id: '3',
    title: 'Ampliamos capacidad de producción',
    slug: 'ampliacion-planta',
    excerpt: 'Inversión en maquinaria offset de última generación.',
    content:
      'Con la instalación de una nueva prensa offset de 6 colores, duplicamos nuestra capacidad productiva y mejoramos los tiempos de entrega para proyectos de gran volumen.',
    image: generarImagen('#E4007C', 'Noticia 3'),
    date: '2026-01-10',
  },
]

/** Clientes y marcas atendidas (RF-012). */
export const clientes: Cliente[] = [
  { id: '1', name: 'Nestlé', logo: generarImagen('#1a1a1a', 'Nestlé'), industry: 'Alimentos' },
  { id: '2', name: 'Bavaria', logo: generarImagen('#FFD600', 'Bavaria'), industry: 'Bebidas' },
  { id: '3', name: 'Colgate', logo: generarImagen('#E4007C', 'Colgate'), industry: 'Cuidado personal' },
  { id: '4', name: 'Éxito', logo: generarImagen('#FFEB3B', 'Éxito'), industry: 'Retail' },
  { id: '5', name: 'Pfizer', logo: generarImagen('#00AEEF', 'Pfizer'), industry: 'Farmacéutico' },
  { id: '6', name: 'Alpina', logo: generarImagen('#4CAF50', 'Alpina'), industry: 'Alimentos' },
]

/** Certificaciones de calidad (RF-011). */
export const certificaciones: Certificacion[] = [
  {
    id: '1',
    name: 'ISO 9001:2015',
    issuer: 'Bureau Veritas',
    year: '2024',
    description: 'Sistema de gestión de calidad certificado.',
    image: generarImagen('#00AEEF', 'ISO 9001'),
  },
  {
    id: '2',
    name: 'FSC Chain of Custody',
    issuer: 'Forest Stewardship Council',
    year: '2026',
    description: 'Trazabilidad de materiales de bosques responsables.',
    image: generarImagen('#4CAF50', 'FSC'),
  },
  {
    id: '3',
    name: 'BRC Packaging',
    issuer: 'BRC Global Standards',
    year: '2025',
    description: 'Estándar de seguridad alimentaria en empaques.',
    image: generarImagen('#E4007C', 'BRC'),
  },
]

/** Testimonios de clientes satisfechos (RF-013). */
export const testimonios: Testimonio[] = [
  {
    id: '1',
    name: 'María González',
    company: 'Distribuidora Nacional',
    role: 'Gerente de Marketing',
    content:
      'Aleph Impresores ha sido un aliado clave en el rediseño de nuestros empaques. Su equipo creativo y cumplimiento de plazos nos permitieron lanzar a tiempo.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Carlos Ruiz',
    company: 'Laboratorios Salud',
    role: 'Director de Compras',
    content:
      'La calidad de impresión y los acabados especiales superaron nuestras expectativas. Recomendamos ampliamente sus servicios.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Ana Martínez',
    company: 'Boutique Élite',
    role: 'Propietaria',
    content:
      'Las bolsas y empaques premium que desarrollaron reflejan perfectamente la identidad de nuestra marca.',
    rating: 5,
  },
]

/**
 * Obtiene una noticia por su slug (delegado al contenido editorial en caché).
 * @param slug - Identificador de URL de la noticia.
 */
export { obtenerNoticiaPorSlug } from './contenidoEditorial'
