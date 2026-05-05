export const SexosNutricion = {
  HOMBRE: 'HOMBRE',
  MUJER: 'MUJER',
} as const

export const NivelesActividad = {
  INACTIVO: 'INACTIVO',
  POCO_ACTIVO: 'POCO_ACTIVO',
  ACTIVO: 'ACTIVO',
  MUY_ACTIVO: 'MUY_ACTIVO',
} as const

export const ObjetivosNutricionales = {
  MANTENIMIENTO: 'MANTENIMIENTO',
  DEFINICION: 'DEFINICION',
  VOLUMEN: 'VOLUMEN',
} as const

export const IntensidadesObjetivo = {
  LEVE: 'LEVE',
  MODERADO: 'MODERADO',
  ALTO: 'ALTO',
} as const

export const ModosCalculoNutricional = {
  ESTANDAR: 'ESTANDAR',
  AVANZADO: 'AVANZADO',
} as const

export type SexoNutricion = (typeof SexosNutricion)[keyof typeof SexosNutricion]
export type NivelActividad = (typeof NivelesActividad)[keyof typeof NivelesActividad]
export type ObjetivoNutricional = (typeof ObjetivosNutricionales)[keyof typeof ObjetivosNutricionales]
export type IntensidadObjetivo = (typeof IntensidadesObjetivo)[keyof typeof IntensidadesObjetivo]
export type ModoCalculoNutricional = (typeof ModosCalculoNutricional)[keyof typeof ModosCalculoNutricional]

export type CalculoNutricionalInput = {
  sexo: SexoNutricion
  edad: number
  pesoKg: number
  tallaCm: number
  nivelActividad: NivelActividad
  objetivo: ObjetivoNutricional
  porcentajeGrasa?: number | null
  intensidadObjetivo?: IntensidadObjetivo | null
}

export type CalculoNutricionalResultado = {
  modoUsado: ModoCalculoNutricional
  objetivo: ObjetivoNutricional
  intensidadObjetivoAplicada?: IntensidadObjetivo
  caloriasMantenimiento: number
  caloriasObjetivo: number
  proteinaGramos: number
  carbohidratosGramos: number
  grasaGramos: number
  proteinaKcal: number
  carbohidratosKcal: number
  grasaKcal: number
  masaMagraKg?: number
  observaciones: string[]
  advertencias: string[]
  caloriasRecalculadas: number
}
