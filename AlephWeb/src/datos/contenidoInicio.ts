/**
 * @file contenidoInicio.ts
 * @description Contenido editable de la página de inicio (IndexedDB + defaults).
 */

import { configuracionSitio } from './configuracionSitio'
import { informacionEmpresa } from './empresa'
import { testimonios as testimoniosBase, clientes as clientesBase } from './contenido'
import type { Testimonio } from '../tipos/indice'
import {
  establecerCacheContenidoInicio,
  obtenerCacheContenidoInicio,
} from './cacheContenidoInicio'
import { eliminarDatoSitio, guardarDatoSitio } from '../utilidades/almacenamientoSitio'

export interface EnlaceBoton {
  texto: string
  enlace: string
}

export interface MetricaHero {
  metric: string
  label: string
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
    misionTitulo: string
    mision: string
    visionTitulo: string
    vision: string
    imagen: string | null
    boton: EnlaceBoton
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
    misionTitulo: 'Misión',
    mision: informacionEmpresa.mission,
    visionTitulo: 'Visión',
    vision: informacionEmpresa.vision,
    imagen: null,
    boton: { texto: 'Conócenos más →', enlace: '/nosotros' },
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

function resolverMarcasClientes(parcial: ContenidoInicioParcial): ContenidoInicio['marcasClientes'] {
  const base = contenidoInicioPorDefecto.marcasClientes

  if (parcial.marcasClientes) {
    const ids = parcial.marcasClientes.clienteIds
    return {
      ...base,
      ...parcial.marcasClientes,
      clienteIds: ids?.length ? ids : base.clienteIds,
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
      titulo: 'Marcas con las que hemos trabajado',
      subtitulo: 'Empresas líderes que confían en nuestra calidad',
    }
  }

  return base
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

export async function guardarContenidoInicio(contenido: ContenidoInicio): Promise<ContenidoInicio> {
  const actualizado: ContenidoInicio = {
    ...contenido,
    updatedAt: new Date().toISOString(),
  }

  await guardarDatoSitio(CLAVE_CONTENIDO_INICIO, actualizado)
  establecerCacheContenidoInicio(actualizado)
  window.dispatchEvent(new Event(EVENTO_CONTENIDO_INICIO))
  return actualizado
}

export async function restablecerContenidoInicio(): Promise<ContenidoInicio> {
  await eliminarDatoSitio(CLAVE_CONTENIDO_INICIO)
  const original = { ...contenidoInicioPorDefecto }
  establecerCacheContenidoInicio(original)
  window.dispatchEvent(new Event(EVENTO_CONTENIDO_INICIO))
  return original
}

export { archivoABase64 } from './vacantesRRHH'
