/**
 * @file contenidoInicio.ts
 * @description Contenido editable de la página de inicio (IndexedDB + defaults).
 */

import { configuracionSitio } from './configuracionSitio'
import { informacionEmpresa } from './empresa'
import { testimonios as testimoniosBase, clientes as clientesBase } from './contenido'
import type { Cliente, Testimonio } from '../tipos/indice'
import {
  establecerCacheContenidoInicio,
  obtenerCacheContenidoInicio,
} from './cacheContenidoInicio'
import {
  guardarContenidoInicioApi,
  haySesionAdmin,
  obtenerContenidoInicioApi,
} from '../servicios/api'

export interface EnlaceBoton {
  texto: string
  enlace: string
}

export interface MetricaHero {
  metric: string
  label: string
}

export interface ValorEmpresa {
  title: string
  description: string
}

export interface ContenidoInicio {
  updatedAt: string | null
  seo: {
    titulo: string
    descripcion: string
  }
  hero: {
    linea1: string
    linea2: string
    parrafo: string
    fondoImagen: string | null
    botonPortafolio: EnlaceBoton
    botonCotizar: EnlaceBoton
    botonTrabaja: EnlaceBoton
  }
  sobreNosotros: {
    titulo: string
    historiaTitulo: string
    historia: string
    misionTitulo: string
    mision: string
    visionTitulo: string
    vision: string
    imagen: string | null
    boton: EnlaceBoton
    valoresTitulo: string
    valores: ValorEmpresa[]
    experienciaTitulo: string
    experienciaSubtitulo: string
    metricas: MetricaHero[]
  }
  especialidades: {
    titulo: string
    categoriaIds: string[]
    imagenes: Record<string, string | null>
    enlaceVerTodo: EnlaceBoton
  }
  marcasClientes: {
    titulo: string
    subtitulo: string
    items: Cliente[]
    clienteIds: string[]
    logos: Record<string, string | null>
    enlaceVerTodo: EnlaceBoton
  }
  testimonios: {
    titulo: string
    subtitulo: string
    items: Testimonio[]
  }
  ctaCotizacion: {
    titulo: string
    parrafo: string
    imagenFondo: string | null
    boton: EnlaceBoton
  }
  contacto: {
    titulo: string
    direccion: string
    telefono: string
    email: string
    mapEmbedUrl: string
    boton: EnlaceBoton
  }
}

export const CLAVE_CONTENIDO_INICIO = 'aleph_contenido_inicio'
export const EVENTO_CONTENIDO_INICIO = 'aleph:contenido-inicio-actualizado'

export const contenidoInicioPorDefecto: ContenidoInicio = {
  updatedAt: null,
  seo: {
    titulo: configuracionSitio.seo.defaultTitle,
    descripcion: configuracionSitio.seo.defaultDescription,
  },
  hero: {
    linea1: 'Dominando el',
    linea2: 'Arte del Color',
    parrafo:
      'Precisión industrial, creatividad de estudio. Traducimos tu visión en empaques y piezas gráficas que destacan en el punto de venta — con tecnología Heidelberg y dominio total del color.',
    fondoImagen: null,
    botonPortafolio: { texto: 'Nuestro portafolio →', enlace: '/galeria' },
    botonCotizar: { texto: 'Cotizar proyecto', enlace: '/cotizacion' },
    botonTrabaja: { texto: 'Trabaja con nosotros', enlace: '/trabaja-con-nosotros' },
  },
  sobreNosotros: {
    titulo: 'Sobre nosotros',
    historiaTitulo: 'Nuestra historia',
    historia: informacionEmpresa.history,
    misionTitulo: 'Misión',
    mision: informacionEmpresa.mission,
    visionTitulo: 'Visión',
    vision: informacionEmpresa.vision,
    imagen: null,
    boton: { texto: 'Conócenos más →', enlace: '/nosotros' },
    valoresTitulo: 'Nuestros valores',
    valores: informacionEmpresa.values.map((v) => ({ ...v })),
    experienciaTitulo: 'Experiencia',
    experienciaSubtitulo: 'Números que respaldan nuestro trabajo',
    metricas: informacionEmpresa.experience.map((m) => ({ ...m })),
  },
  especialidades: {
    titulo: 'Nuestras especialidades',
    categoriaIds: ['plegadizas', 'bolsas', 'exhibidores'],
    imagenes: {},
    enlaceVerTodo: { texto: 'Ver todas las categorías →', enlace: '/productos' },
  },
  marcasClientes: {
    titulo: 'Marcas con las que hemos trabajado',
    subtitulo: 'Empresas líderes que confían en nuestra calidad',
    items: clientesBase.map((c) => ({ ...c })),
    clienteIds: clientesBase.map((c) => c.id),
    logos: {},
    enlaceVerTodo: { texto: 'Ver todos nuestros clientes →', enlace: '/clientes' },
  },
  testimonios: {
    titulo: 'Lo que dicen nuestros clientes',
    subtitulo: 'Lee opiniones reales o deja la tuya',
    items: testimoniosBase.map((t) => ({ ...t })),
  },
  ctaCotizacion: {
    titulo: '¿Listo para imprimir tu próxima obra maestra?',
    parrafo: 'Cuéntanos tu proyecto y recibe una propuesta personalizada.',
    imagenFondo: null,
    boton: { texto: 'Solicitar cotización', enlace: '/cotizacion' },
  },
  contacto: {
    titulo: 'Contáctanos',
    direccion: configuracionSitio.address,
    telefono: configuracionSitio.phone,
    email: configuracionSitio.email,
    mapEmbedUrl: '',
    boton: { texto: '¿Quieres enviar un mensaje?', enlace: '/contacto' },
  },
}

const DIRECCIONES_OBSLETAS = [
  'Calle 123 #45-67, Bogotá, Colombia',
  'Carrera 70 #127-58, Bogotá, Colombia',
]

/** Datos guardados antes de renombrar la sección de productos destacados. */
interface ProductosDestacadosLegacy {
  titulo: string
  subtitulo: string
  productoIds: string[]
  imagenes: Record<string, string | null>
}

type ContenidoInicioParcial = Partial<ContenidoInicio> & {
  productosDestacados?: ProductosDestacadosLegacy
  hero?: Partial<ContenidoInicio['hero']> & { metricas?: MetricaHero[] }
}

function logoMarcaPlaceholder(nombre: string): string {
  const texto = (nombre.trim() || 'Marca').slice(0, 14)
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="120" viewBox="0 0 240 120">
      <rect fill="#1a2830" width="240" height="120" rx="8"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8fa3ad" font-family="sans-serif" font-size="14">${texto}</text>
    </svg>`,
  )}`
}

function aplicarLogosAMarcas(
  items: Cliente[],
  logos: Record<string, string | null>,
): Cliente[] {
  return items.map((marca) => {
    const logoSubido = logos[marca.id]
    if (logoSubido) return { ...marca, logo: logoSubido }
    if (marca.logo) return marca
    return { ...marca, logo: logoMarcaPlaceholder(marca.name) }
  })
}

function resolverItemsMarcas(parcial: ContenidoInicioParcial): Cliente[] {
  const base = contenidoInicioPorDefecto.marcasClientes
  const logos = { ...base.logos, ...parcial.marcasClientes?.logos }

  if (parcial.marcasClientes?.items?.length) {
    return aplicarLogosAMarcas(parcial.marcasClientes.items, logos)
  }

  return aplicarLogosAMarcas(base.items.map((c) => ({ ...c })), logos)
}

function resolverMarcasClientes(parcial: ContenidoInicioParcial): ContenidoInicio['marcasClientes'] {
  const base = contenidoInicioPorDefecto.marcasClientes
  const items = resolverItemsMarcas(parcial)
  const idsDisponibles = new Set(items.map((m) => m.id))

  if (parcial.marcasClientes) {
    const ids = (parcial.marcasClientes.clienteIds ?? base.clienteIds).filter((id) =>
      idsDisponibles.has(id),
    )
    return {
      ...base,
      ...parcial.marcasClientes,
      items,
      clienteIds: ids.length ? ids : items.map((m) => m.id),
      logos: { ...base.logos, ...parcial.marcasClientes.logos },
      enlaceVerTodo: {
        ...base.enlaceVerTodo,
        ...parcial.marcasClientes.enlaceVerTodo,
      },
    }
  }

  if (parcial.productosDestacados) {
    return {
      ...base,
      items,
      titulo: 'Marcas con las que hemos trabajado',
      subtitulo: 'Empresas líderes que confían en nuestra calidad',
    }
  }

  return { ...base, items }
}

export function fusionarContenidoInicio(parcial: ContenidoInicioParcial): ContenidoInicio {
  const base = contenidoInicioPorDefecto
  return {
    ...base,
    ...parcial,
    updatedAt: parcial.updatedAt ?? base.updatedAt,
    seo: { ...base.seo, ...parcial.seo },
    hero: {
      ...base.hero,
      ...parcial.hero,
      botonPortafolio: { ...base.hero.botonPortafolio, ...parcial.hero?.botonPortafolio },
      botonCotizar: { ...base.hero.botonCotizar, ...parcial.hero?.botonCotizar },
      botonTrabaja: { ...base.hero.botonTrabaja, ...parcial.hero?.botonTrabaja },
    },
    sobreNosotros: {
      ...base.sobreNosotros,
      ...parcial.sobreNosotros,
      boton: { ...base.sobreNosotros.boton, ...parcial.sobreNosotros?.boton },
      valores: parcial.sobreNosotros?.valores ?? base.sobreNosotros.valores,
      metricas:
        parcial.sobreNosotros?.metricas ??
        parcial.hero?.metricas ??
        base.sobreNosotros.metricas,
    },
    especialidades: {
      ...base.especialidades,
      ...parcial.especialidades,
      imagenes: { ...base.especialidades.imagenes, ...parcial.especialidades?.imagenes },
      enlaceVerTodo: {
        ...base.especialidades.enlaceVerTodo,
        ...parcial.especialidades?.enlaceVerTodo,
      },
    },
    marcasClientes: resolverMarcasClientes(parcial),
    testimonios: {
      ...base.testimonios,
      ...parcial.testimonios,
      items: parcial.testimonios?.items ?? base.testimonios.items,
    },
    ctaCotizacion: {
      ...base.ctaCotizacion,
      ...parcial.ctaCotizacion,
      boton: { ...base.ctaCotizacion.boton, ...parcial.ctaCotizacion?.boton },
    },
    contacto: {
      ...base.contacto,
      ...parcial.contacto,
      boton: { ...base.contacto.boton, ...parcial.contacto?.boton },
    },
  }
}

export function normalizarContenidoInicio(contenido: ContenidoInicio): ContenidoInicio {
  let normalizado = contenido

  if (!normalizado.sobreNosotros.metricas?.length) {
    normalizado = {
      ...normalizado,
      sobreNosotros: {
        ...normalizado.sobreNosotros,
        metricas: [...contenidoInicioPorDefecto.sobreNosotros.metricas],
      },
    }
  }

  if (!normalizado.sobreNosotros.valores?.length) {
    normalizado = {
      ...normalizado,
      sobreNosotros: {
        ...normalizado.sobreNosotros,
        valores: [...contenidoInicioPorDefecto.sobreNosotros.valores],
      },
    }
  }

  if (!normalizado.sobreNosotros.historia?.trim()) {
    normalizado = {
      ...normalizado,
      sobreNosotros: {
        ...normalizado.sobreNosotros,
        historia: contenidoInicioPorDefecto.sobreNosotros.historia,
      },
    }
  }

  if (!normalizado.marcasClientes) {
    normalizado = {
      ...normalizado,
      marcasClientes: { ...contenidoInicioPorDefecto.marcasClientes },
    }
  } else if (!normalizado.marcasClientes.clienteIds?.length) {
    normalizado = {
      ...normalizado,
      marcasClientes: {
        ...normalizado.marcasClientes,
        clienteIds: normalizado.marcasClientes.items.map((m) => m.id),
      },
    }
  }

  if (!normalizado.marcasClientes.items?.length) {
    normalizado = {
      ...normalizado,
      marcasClientes: {
        ...normalizado.marcasClientes,
        items: [...contenidoInicioPorDefecto.marcasClientes.items],
        clienteIds: [...contenidoInicioPorDefecto.marcasClientes.clienteIds],
      },
    }
  }

  if (!DIRECCIONES_OBSLETAS.includes(normalizado.contacto.direccion)) {
    return normalizado
  }

  return {
    ...normalizado,
    contacto: {
      ...normalizado.contacto,
      direccion: contenidoInicioPorDefecto.contacto.direccion,
      mapEmbedUrl: '',
    },
  }
}

export function obtenerContenidoInicio(): ContenidoInicio {
  const cache = obtenerCacheContenidoInicio()
  if (cache) return cache
  return { ...contenidoInicioPorDefecto }
}

/** Marcas visibles en el carrusel de la portada, en el orden configurado. */
export function obtenerMarcasInicioVisibles(contenido = obtenerContenidoInicio()): Cliente[] {
  const { items, clienteIds } = contenido.marcasClientes
  return clienteIds
    .map((id) => items.find((m) => m.id === id))
    .filter((m): m is Cliente => Boolean(m))
}

/** Catálogo completo de marcas/clientes editable desde el admin. */
export function obtenerMarcasCatalogo(contenido = obtenerContenidoInicio()): Cliente[] {
  return contenido.marcasClientes.items
}

export function crearMarcaVacia(): Cliente {
  const id = `marca-${Date.now()}`
  return {
    id,
    name: 'Nueva marca',
    industry: '',
    logo: logoMarcaPlaceholder('Nueva marca'),
  }
}

export async function cargarContenidoInicioDesdeApi(): Promise<ContenidoInicio> {
  try {
    const remoto = await obtenerContenidoInicioApi()
    if (remoto && typeof remoto === 'object') {
      const contenido = normalizarContenidoInicio(
        fusionarContenidoInicio(remoto as Partial<ContenidoInicio>),
      )
      establecerCacheContenidoInicio(contenido)
      window.dispatchEvent(new Event(EVENTO_CONTENIDO_INICIO))
      return contenido
    }
  } catch (error) {
    console.warn('No se pudo cargar contenido inicio desde API:', error)
  }

  const original = { ...contenidoInicioPorDefecto }
  establecerCacheContenidoInicio(original)
  return original
}

export async function guardarContenidoInicio(contenido: ContenidoInicio): Promise<ContenidoInicio> {
  const actualizado: ContenidoInicio = {
    ...contenido,
    updatedAt: new Date().toISOString(),
  }

  if (!haySesionAdmin()) {
    throw new Error('Sesión expirada. Cierra sesión e ingresa de nuevo al panel.')
  }

  try {
    await guardarContenidoInicioApi(actualizado)
  } catch (error) {
    const mensaje =
      error instanceof Error ? error.message : 'No se pudo guardar en la base de datos.'
    throw new Error(mensaje)
  }

  establecerCacheContenidoInicio(actualizado)
  window.dispatchEvent(new Event(EVENTO_CONTENIDO_INICIO))
  return actualizado
}

export async function restablecerContenidoInicio(): Promise<ContenidoInicio> {
  const original = { ...contenidoInicioPorDefecto }

  if (haySesionAdmin()) {
    await guardarContenidoInicioApi(original)
  }

  establecerCacheContenidoInicio(original)
  window.dispatchEvent(new Event(EVENTO_CONTENIDO_INICIO))
  return original
}

export { archivoABase64 } from './vacantesRRHH'
export { archivoAImagenWebp } from '../utilidades/optimizarImagen'
