/**
 * Contenido editorial editable: noticias, certificaciones, galería, industrias, servicios y config del sitio.
 */

import {
  certificaciones as certificacionesDefecto,
  noticias as noticiasDefecto,
  proyectosGaleria as galeriaDefecto,
} from './contenido'
import { industrias as industriasDefecto, servicios as serviciosDefecto } from './empresa'
import { configuracionSitio as configDefecto } from './configuracionSitio'
import {
  establecerCacheContenidoEditorial,
  obtenerCacheContenidoEditorial,
} from './cacheContenidoEditorial'
import { guardarContenidoEditorialApi, haySesionAdmin, obtenerContenidoEditorialApi } from '../servicios/api'
import type { Certificacion, Noticia, ProyectoGaleria } from '../tipos/indice'

export interface IndustriaEditorial {
  id: string
  name: string
  description: string
  icon: string
}

export interface ServicioEditorial {
  id: string
  name: string
  description: string
}

export interface ConfiguracionSitioEditorial {
  tagline: string
  horarios: string[]
  emailRRHH: string
}

export interface TextosPaginaNosotros {
  certificacionesTitulo: string
  certificacionesSubtitulo: string
  equipoTitulo: string
  equipoTexto: string
}

export interface EnlaceBotonEditorial {
  texto: string
  enlace: string
}

export interface PasoProcesoServicios {
  id: string
  titulo: string
  texto: string
}

export interface TextosPaginaServicios {
  seoDescripcion: string
  hero: {
    etiqueta: string
    tituloAntes: string
    tituloDestacado: string
    tituloDespues: string
    parrafo: string
    botonPrincipal: EnlaceBotonEditorial
    botonSecundario: EnlaceBotonEditorial
    panelEtiqueta: string
    panelTexto: string
  }
  proceso: {
    titulo: string
    subtitulo: string
    pasos: PasoProcesoServicios[]
  }
  listado: {
    titulo: string
    subtitulo: string
  }
  cta: {
    titulo: string
    texto: string
    botonPrincipal: EnlaceBotonEditorial
    botonSecundario: EnlaceBotonEditorial
  }
}

export interface AreaTrabajoEditorial {
  id: string
  name: string
  description: string
  icon: string
}

export interface BeneficioTrabajaEditorial {
  id: string
  icon: string
  titulo: string
  texto: string
}

export interface FaqTrabajaEditorial {
  id: string
  pregunta: string
  respuesta: string
}

export interface TextosPaginaTrabaja {
  seoDescripcion: string
  hero: {
    etiqueta: string
    tituloAntes: string
    tituloDestacado: string
    tituloDespues: string
    parrafo: string
    botonVacantes: EnlaceBotonEditorial
    botonPostular: EnlaceBotonEditorial
    panelEtiqueta: string
    panelTexto: string
  }
  vacantes: {
    titulo: string
    subtitulo: string
    sinVacantesTitulo: string
    sinVacantesTexto: string
  }
  areas: {
    titulo: string
    subtitulo: string
    items: AreaTrabajoEditorial[]
  }
  beneficios: {
    titulo: string
    subtitulo: string
    items: BeneficioTrabajaEditorial[]
  }
  formulario: {
    titulo: string
    subtitulo: string
    notaPrivacidad: string
  }
  proceso: {
    titulo: string
    subtitulo: string
    pasos: PasoProcesoServicios[]
  }
  faq: {
    titulo: string
    items: FaqTrabajaEditorial[]
  }
}

export interface ContenidoEditorial {
  updatedAt: string | null
  noticias: Noticia[]
  certificaciones: Certificacion[]
  galeria: ProyectoGaleria[]
  industrias: IndustriaEditorial[]
  servicios: ServicioEditorial[]
  paginaNosotros: TextosPaginaNosotros
  paginaServicios: TextosPaginaServicios
  paginaTrabaja: TextosPaginaTrabaja
  sitio: ConfiguracionSitioEditorial
}

export const EVENTO_CONTENIDO_EDITORIAL = 'contenido-editorial-actualizado'

export const textosPaginaNosotrosDefecto: TextosPaginaNosotros = {
  certificacionesTitulo: 'Certificaciones',
  certificacionesSubtitulo: 'Compromiso con la calidad y el cumplimiento normativo.',
  equipoTitulo: 'Nuestro equipo',
  equipoTexto:
    'Profesionales apasionados por la excelencia gráfica, comprometidos con cada proyecto.',
}

export const textosPaginaServiciosDefecto: TextosPaginaServicios = {
  seoDescripcion:
    'Diseño gráfico, impresión offset y digital, acabados especiales y logística.',
  hero: {
    etiqueta: 'Soluciones integrales',
    tituloAntes: 'Servicios de ',
    tituloDestacado: 'impresión',
    tituloDespues: ' y empaque',
    parrafo:
      'Acompañamos tu proyecto desde el diseño creativo hasta la entrega final. Precisión CMYK, acabados de alto impacto y tiempos de respuesta ágiles.',
    botonPrincipal: { texto: 'Solicitar cotización →', enlace: '/cotizacion' },
    botonSecundario: { texto: 'Ver portafolio', enlace: '/productos' },
    panelEtiqueta: 'De la idea al producto',
    panelTexto: 'Diseño · Impresión · Acabados · Logística',
  },
  proceso: {
    titulo: 'Cómo trabajamos',
    subtitulo: 'Un proceso claro en cada etapa, con acompañamiento técnico y comercial',
    pasos: [
      {
        id: 'paso-consulta',
        titulo: 'Consulta',
        texto: 'Analizamos tu proyecto, materiales y plazos para definir la mejor solución.',
      },
      {
        id: 'paso-diseno',
        titulo: 'Diseño',
        texto: 'Desarrollamos artes gráficas y estructuras de empaque a medida.',
      },
      {
        id: 'paso-produccion',
        titulo: 'Producción',
        texto: 'Impresión offset o digital con acabados especiales y control de calidad.',
      },
      {
        id: 'paso-entrega',
        titulo: 'Entrega',
        texto: 'Logística coordinada para que tu material llegue a tiempo y en perfecto estado.',
      },
    ],
  },
  listado: {
    titulo: 'Nuestros servicios',
    subtitulo: 'Capacidades técnicas para marcas que exigen calidad en cada detalle',
  },
  cta: {
    titulo: '¿Listo para iniciar tu proyecto?',
    texto:
      'Cuéntanos qué necesitas imprimir o empaquetar. Nuestro equipo te asesora en materiales, acabados y tiempos de producción.',
    botonPrincipal: { texto: 'Comenzar una consulta', enlace: '/cotizacion' },
    botonSecundario: { texto: 'Hablar con ventas', enlace: '/contacto' },
  },
}

export const textosPaginaTrabajaDefecto: TextosPaginaTrabaja = {
  seoDescripcion:
    'Únete al equipo de Aleph Impresores. Consulta vacantes disponibles y envía tu hoja de vida a Recursos Humanos.',
  hero: {
    etiqueta: 'Talento gráfico e industrial',
    tituloAntes: 'Construye tu carrera en ',
    tituloDestacado: 'impresión',
    tituloDespues: ' de alto nivel',
    parrafo:
      'Únete a un equipo que combina precisión industrial y creatividad gráfica. Consulta nuestras vacantes y envía tu hoja de vida a Recursos Humanos.',
    botonVacantes: { texto: 'Ver vacantes →', enlace: '#vacantes' },
    botonPostular: { texto: 'Enviar hoja de vida', enlace: '#postulacion' },
    panelEtiqueta: 'Áreas de oportunidad',
    panelTexto: 'Producción · Preprensa · Ventas · Logística',
  },
  vacantes: {
    titulo: 'Vacantes disponibles',
    subtitulo: 'Publicación actualizada por Recursos Humanos',
    sinVacantesTitulo: 'Sin vacantes publicadas por ahora',
    sinVacantesTexto:
      'En este momento no hay vacantes publicadas. Aun así puedes dejarnos tu hoja de vida y te tendremos en cuenta para futuras oportunidades.',
  },
  areas: {
    titulo: '¿En qué área te gustaría trabajar?',
    subtitulo: 'Selecciona tu área de interés al enviar tu postulación',
    items: [
      {
        id: 'produccion',
        name: 'Producción',
        description: 'Operación de prensas, control de color y acabados en línea.',
        icon: '⚙️',
      },
      {
        id: 'preprensa',
        name: 'Preprensa y diseño',
        description: 'Arte final, pruebas de color y preparación de archivos para impresión.',
        icon: '🎨',
      },
      {
        id: 'ventas',
        name: 'Ventas y cotización',
        description: 'Asesoría comercial, seguimiento de clientes y desarrollo de negocio.',
        icon: '🤝',
      },
      {
        id: 'logistica',
        name: 'Logística',
        description: 'Despacho, inventario y coordinación de entregas a nivel nacional.',
        icon: '📦',
      },
    ],
  },
  beneficios: {
    titulo: 'Por qué trabajar en Aleph',
    subtitulo: 'Un entorno donde la excelencia gráfica es el estándar',
    items: [
      {
        id: 'benef-tecnologia',
        icon: '🏭',
        titulo: 'Tecnología industrial',
        texto: 'Equipos de impresión offset y digital, acabados especiales y control de calidad riguroso.',
      },
      {
        id: 'benef-crecimiento',
        icon: '📈',
        titulo: 'Crecimiento profesional',
        texto: 'Oportunidades de desarrollo en producción, preprensa, ventas y logística.',
      },
      {
        id: 'benef-capacitacion',
        icon: '🎓',
        titulo: 'Capacitación continua',
        texto: 'Formación en color, acabados y procesos gráficos con estándares de la industria.',
      },
      {
        id: 'benef-equipo',
        icon: '🤝',
        titulo: 'Equipo colaborativo',
        texto: 'Ambiente de trabajo orientado a resultados, con comunicación clara entre áreas.',
      },
    ],
  },
  formulario: {
    titulo: 'Envía tu hoja de vida',
    subtitulo: 'Será revisada por Recursos Humanos',
    notaPrivacidad:
      'Tu información y CV solo serán revisados por el equipo de Recursos Humanos. No compartimos tus datos con terceros.',
  },
  proceso: {
    titulo: 'Proceso de selección',
    subtitulo: 'Pasos claros desde tu postulación hasta la bienvenida al equipo',
    pasos: [
      {
        id: 'paso-cv',
        titulo: 'Envías tu hoja de vida',
        texto: 'Completa el formulario y adjunta tu CV en PDF o Word (máx. 5 MB).',
      },
      {
        id: 'paso-revision',
        titulo: 'Revisamos tu perfil',
        texto: 'RRHH evalúa tu experiencia y lo contrasta con nuestras vacantes abiertas.',
      },
      {
        id: 'paso-entrevista',
        titulo: 'Entrevista con el equipo',
        texto: 'Si tu perfil encaja, te contactamos para una entrevista presencial o virtual.',
      },
      {
        id: 'paso-bienvenida',
        titulo: 'Te damos la bienvenida',
        texto: 'Integramos a los seleccionados con inducción y acompañamiento en planta.',
      },
    ],
  },
  faq: {
    titulo: 'Preguntas frecuentes',
    items: [
      {
        id: 'faq-sin-vacantes',
        pregunta: '¿Puedo postularme aunque no haya vacantes publicadas?',
        respuesta:
          'Sí. Puedes dejar tu hoja de vida en nuestra base de talento y te contactaremos cuando surja una vacante compatible con tu perfil.',
      },
      {
        id: 'faq-formatos',
        pregunta: '¿Qué formatos de CV aceptan?',
        respuesta: 'Aceptamos PDF, DOC y DOCX con un tamaño máximo de 5 MB.',
      },
      {
        id: 'faq-tiempo',
        pregunta: '¿Cuánto tardan en responder?',
        respuesta:
          'Revisamos las postulaciones de forma continua. Si tu perfil encaja, RRHH te contactará en un plazo aproximado de 3 a 10 días hábiles.',
      },
      {
        id: 'faq-presencial',
        pregunta: '¿El trabajo es presencial?',
        respuesta:
          'La mayoría de nuestras vacantes son presenciales en planta. Los detalles específicos se confirman durante el proceso de selección.',
      },
    ],
  },
}

function generarId(prefijo: string) {
  return `${prefijo}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

function normalizarSlug(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function crearSlugNoticia(titulo: string, existentes: Noticia[], idActual?: string) {
  const base = normalizarSlug(titulo) || 'noticia'
  let slug = base
  let n = 2
  while (existentes.some((item) => item.slug === slug && item.id !== idActual)) {
    slug = `${base}-${n}`
    n += 1
  }
  return slug
}

function industriasDesdeDefecto(): IndustriaEditorial[] {
  return industriasDefecto.map((i) => ({
    id: generarId('ind'),
    name: i.name,
    description: i.description,
    icon: i.icon,
  }))
}

function serviciosDesdeDefecto(): ServicioEditorial[] {
  return serviciosDefecto.map((s) => ({
    id: generarId('srv'),
    name: s.name,
    description: s.description,
  }))
}

export function contenidoEditorialDefecto(): ContenidoEditorial {
  return {
    updatedAt: null,
    noticias: noticiasDefecto.map((n) => ({ ...n })),
    certificaciones: certificacionesDefecto.map((c) => ({ ...c })),
    galeria: galeriaDefecto.map((p) => ({ ...p })),
    industrias: industriasDesdeDefecto(),
    servicios: serviciosDesdeDefecto(),
    paginaNosotros: { ...textosPaginaNosotrosDefecto },
    paginaServicios: structuredClone(textosPaginaServiciosDefecto),
    paginaTrabaja: structuredClone(textosPaginaTrabajaDefecto),
    sitio: {
      tagline: configDefecto.tagline,
      horarios: [...configDefecto.horarios],
      emailRRHH: configDefecto.emailRRHH,
    },
  }
}

function fusionarContenidoEditorial(datos: Partial<ContenidoEditorial> | null): ContenidoEditorial {
  const base = contenidoEditorialDefecto()
  if (!datos) return base

  return {
    updatedAt: datos.updatedAt ?? base.updatedAt,
    noticias: Array.isArray(datos.noticias) && datos.noticias.length > 0 ? datos.noticias : base.noticias,
    certificaciones:
      Array.isArray(datos.certificaciones) && datos.certificaciones.length > 0
        ? datos.certificaciones
        : base.certificaciones,
    galeria: Array.isArray(datos.galeria) && datos.galeria.length > 0 ? datos.galeria : base.galeria,
    industrias:
      Array.isArray(datos.industrias) && datos.industrias.length > 0 ? datos.industrias : base.industrias,
    servicios:
      Array.isArray(datos.servicios) && datos.servicios.length > 0 ? datos.servicios : base.servicios,
    paginaNosotros: { ...base.paginaNosotros, ...datos.paginaNosotros },
    paginaServicios: fusionarPaginaServicios(base.paginaServicios, datos.paginaServicios),
    paginaTrabaja: fusionarPaginaTrabaja(base.paginaTrabaja, datos.paginaTrabaja),
    sitio: { ...base.sitio, ...datos.sitio },
  }
}

function fusionarPaginaServicios(
  base: TextosPaginaServicios,
  parcial?: Partial<TextosPaginaServicios>,
): TextosPaginaServicios {
  if (!parcial) return base

  return {
    seoDescripcion: parcial.seoDescripcion ?? base.seoDescripcion,
    hero: {
      ...base.hero,
      ...parcial.hero,
      botonPrincipal: { ...base.hero.botonPrincipal, ...parcial.hero?.botonPrincipal },
      botonSecundario: { ...base.hero.botonSecundario, ...parcial.hero?.botonSecundario },
    },
    proceso: {
      ...base.proceso,
      ...parcial.proceso,
      pasos:
        Array.isArray(parcial.proceso?.pasos) && parcial.proceso.pasos.length > 0
          ? parcial.proceso.pasos
          : base.proceso.pasos,
    },
    listado: { ...base.listado, ...parcial.listado },
    cta: {
      ...base.cta,
      ...parcial.cta,
      botonPrincipal: { ...base.cta.botonPrincipal, ...parcial.cta?.botonPrincipal },
      botonSecundario: { ...base.cta.botonSecundario, ...parcial.cta?.botonSecundario },
    },
  }
}

function fusionarPaginaTrabaja(
  base: TextosPaginaTrabaja,
  parcial?: Partial<TextosPaginaTrabaja>,
): TextosPaginaTrabaja {
  if (!parcial) return base

  return {
    seoDescripcion: parcial.seoDescripcion ?? base.seoDescripcion,
    hero: {
      ...base.hero,
      ...parcial.hero,
      botonVacantes: { ...base.hero.botonVacantes, ...parcial.hero?.botonVacantes },
      botonPostular: { ...base.hero.botonPostular, ...parcial.hero?.botonPostular },
    },
    vacantes: { ...base.vacantes, ...parcial.vacantes },
    areas: {
      ...base.areas,
      ...parcial.areas,
      items:
        Array.isArray(parcial.areas?.items) && parcial.areas.items.length > 0
          ? parcial.areas.items
          : base.areas.items,
    },
    beneficios: {
      ...base.beneficios,
      ...parcial.beneficios,
      items:
        Array.isArray(parcial.beneficios?.items) && parcial.beneficios.items.length > 0
          ? parcial.beneficios.items
          : base.beneficios.items,
    },
    formulario: { ...base.formulario, ...parcial.formulario },
    proceso: {
      ...base.proceso,
      ...parcial.proceso,
      pasos:
        Array.isArray(parcial.proceso?.pasos) && parcial.proceso.pasos.length > 0
          ? parcial.proceso.pasos
          : base.proceso.pasos,
    },
    faq: {
      ...base.faq,
      ...parcial.faq,
      items:
        Array.isArray(parcial.faq?.items) && parcial.faq.items.length > 0
          ? parcial.faq.items
          : base.faq.items,
    },
  }
}

export function obtenerContenidoEditorial(): ContenidoEditorial {
  const cache = obtenerCacheContenidoEditorial()
  return cache ?? contenidoEditorialDefecto()
}

export function obtenerNoticiaPorSlug(slug: string): Noticia | undefined {
  return obtenerContenidoEditorial().noticias.find((n) => n.slug === slug)
}

export function suscribirContenidoEditorial(callback: () => void) {
  window.addEventListener(EVENTO_CONTENIDO_EDITORIAL, callback)
  return () => window.removeEventListener(EVENTO_CONTENIDO_EDITORIAL, callback)
}

export async function cargarContenidoEditorialDesdeApi(): Promise<ContenidoEditorial> {
  try {
    const remoto = await obtenerContenidoEditorialApi()
    const fusionado = fusionarContenidoEditorial(remoto as Partial<ContenidoEditorial> | null)
    establecerCacheContenidoEditorial(fusionado)
    window.dispatchEvent(new Event(EVENTO_CONTENIDO_EDITORIAL))
    return fusionado
  } catch {
    const local = contenidoEditorialDefecto()
    establecerCacheContenidoEditorial(local)
    return local
  }
}

export async function guardarContenidoEditorial(contenido: ContenidoEditorial): Promise<ContenidoEditorial> {
  const actualizado: ContenidoEditorial = {
    ...contenido,
    updatedAt: new Date().toISOString(),
  }

  if (!haySesionAdmin()) {
    throw new Error('Sesión expirada. Cierra sesión e ingresa de nuevo al panel.')
  }

  try {
    await guardarContenidoEditorialApi(actualizado)
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : 'No se pudo guardar en la base de datos.'
    throw new Error(mensaje)
  }

  establecerCacheContenidoEditorial(actualizado)
  window.dispatchEvent(new Event(EVENTO_CONTENIDO_EDITORIAL))
  return actualizado
}

export function noticiaVacia(): Noticia {
  const hoy = new Date().toISOString().slice(0, 10)
  return {
    id: generarId('not'),
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: hoy,
  }
}

export function certificacionVacia(): Certificacion {
  return {
    id: generarId('cert'),
    name: '',
    issuer: '',
    year: new Date().getFullYear().toString(),
    description: '',
    image: '',
  }
}

export function proyectoGaleriaVacio(): ProyectoGaleria {
  return {
    id: generarId('gal'),
    name: '',
    productType: '',
    client: '',
    description: '',
    image: '',
  }
}

export function industriaVacia(): IndustriaEditorial {
  return { id: generarId('ind'), name: '', description: '', icon: '📦' }
}

export function servicioVacio(): ServicioEditorial {
  return { id: generarId('srv'), name: '', description: '' }
}

export function pasoProcesoVacio(): PasoProcesoServicios {
  return { id: generarId('paso'), titulo: '', texto: '' }
}

export function areaTrabajoVacia(): AreaTrabajoEditorial {
  return { id: generarId('area'), name: '', description: '', icon: '💼' }
}

export function beneficioTrabajaVacio(): BeneficioTrabajaEditorial {
  return { id: generarId('benef'), icon: '✦', titulo: '', texto: '' }
}

export function faqTrabajaVacia(): FaqTrabajaEditorial {
  return { id: generarId('faq'), pregunta: '', respuesta: '' }
}

export { generarId }
