import {
  IntensidadesObjetivo,
  ModosCalculoNutricional,
  NivelesActividad,
  ObjetivosNutricionales,
  SexosNutricion,
  type CalculoNutricionalInput,
  type CalculoNutricionalResultado,
  type IntensidadObjetivo,
  type NivelActividad,
  type ObjetivoNutricional,
  type SexoNutricion,
} from './types'

const VALID_SEXOS = new Set<string>(Object.values(SexosNutricion))
const VALID_NIVELES_ACTIVIDAD = new Set<string>(Object.values(NivelesActividad))
const VALID_OBJETIVOS = new Set<string>(Object.values(ObjetivosNutricionales))
const VALID_INTENSIDADES = new Set<string>(Object.values(IntensidadesObjetivo))

const ADVANCED_ACTIVITY_FACTORS: Record<NivelActividad, number> = {
  INACTIVO: 1.2,
  POCO_ACTIVO: 1.375,
  ACTIVO: 1.55,
  MUY_ACTIVO: 1.725,
}

const DEFAULT_INTENSITY = IntensidadesObjetivo.MODERADO

const DEFICIT_BY_INTENSITY: Record<IntensidadObjetivo, number> = {
  LEVE: 0.1,
  MODERADO: 0.15,
  ALTO: 0.2,
}

const SURPLUS_BY_INTENSITY: Record<IntensidadObjetivo, number> = {
  LEVE: 0.05,
  MODERADO: 0.1,
  ALTO: 0.15,
}

const PROTEIN_GRAMS_PER_KG: Record<ObjetivoNutricional, number> = {
  MANTENIMIENTO: 1.8,
  DEFINICION: 2.2,
  VOLUMEN: 1.8,
}

const FAT_PERCENT_BY_GOAL: Record<ObjetivoNutricional, number> = {
  MANTENIMIENTO: 0.3,
  DEFINICION: 0.25,
  VOLUMEN: 0.25,
}

type EerFormula = {
  constant: number
  ageCoefficient: number
  heightCoefficient: number
  weightCoefficient: number
}

const EER_FORMULAS: Record<SexoNutricion, Record<NivelActividad, EerFormula>> = {
  HOMBRE: {
    INACTIVO: { constant: 753.07, ageCoefficient: 10.83, heightCoefficient: 6.5, weightCoefficient: 14.1 },
    POCO_ACTIVO: { constant: 581.47, ageCoefficient: 10.83, heightCoefficient: 8.3, weightCoefficient: 14.94 },
    ACTIVO: { constant: 1004.82, ageCoefficient: 10.83, heightCoefficient: 6.52, weightCoefficient: 15.91 },
    MUY_ACTIVO: { constant: -517.88, ageCoefficient: 10.83, heightCoefficient: 15.61, weightCoefficient: 19.11 },
  },
  MUJER: {
    INACTIVO: { constant: 584.9, ageCoefficient: 7.01, heightCoefficient: 5.72, weightCoefficient: 11.71 },
    POCO_ACTIVO: { constant: 575.77, ageCoefficient: 7.01, heightCoefficient: 6.6, weightCoefficient: 12.14 },
    ACTIVO: { constant: 710.25, ageCoefficient: 7.01, heightCoefficient: 6.54, weightCoefficient: 12.34 },
    MUY_ACTIVO: { constant: 511.83, ageCoefficient: 7.01, heightCoefficient: 9.07, weightCoefficient: 12.56 },
  },
}

function assertValidInput(input: CalculoNutricionalInput): void {
  const errors: string[] = []

  if (!VALID_SEXOS.has(input.sexo)) errors.push('sexo es obligatorio y debe ser HOMBRE o MUJER')
  if (!Number.isFinite(input.edad) || input.edad <= 0) errors.push('edad debe ser mayor que 0')
  if (!Number.isFinite(input.pesoKg) || input.pesoKg <= 0) errors.push('pesoKg debe ser mayor que 0')
  if (!Number.isFinite(input.tallaCm) || input.tallaCm <= 0) errors.push('tallaCm debe ser mayor que 0')
  if (!VALID_NIVELES_ACTIVIDAD.has(input.nivelActividad)) {
    errors.push('nivelActividad es obligatorio y debe ser INACTIVO, POCO_ACTIVO, ACTIVO o MUY_ACTIVO')
  }
  if (!VALID_OBJETIVOS.has(input.objetivo)) {
    errors.push('objetivo es obligatorio y debe ser MANTENIMIENTO, DEFINICION o VOLUMEN')
  }
  if (input.intensidadObjetivo != null && !VALID_INTENSIDADES.has(input.intensidadObjetivo)) {
    errors.push('intensidadObjetivo debe ser LEVE, MODERADO o ALTO')
  }
  if (
    input.porcentajeGrasa != null &&
    (!Number.isFinite(input.porcentajeGrasa) || input.porcentajeGrasa < 2 || input.porcentajeGrasa > 70)
  ) {
    errors.push('porcentajeGrasa debe estar entre 2 y 70 cuando se suministra')
  }

  if (errors.length > 0) {
    throw new Error(`Entrada nutricional invalida: ${errors.join('; ')}`)
  }
}

function roundInteger(value: number): number {
  return Math.round(value)
}

function calculateEerMaintenance(input: CalculoNutricionalInput): number {
  const formula = EER_FORMULAS[input.sexo][input.nivelActividad]

  return (
    formula.constant -
    formula.ageCoefficient * input.edad +
    formula.heightCoefficient * input.tallaCm +
    formula.weightCoefficient * input.pesoKg
  )
}

function calculateAdvancedMaintenance(input: CalculoNutricionalInput, porcentajeGrasa: number) {
  const masaMagraKg = input.pesoKg * (1 - porcentajeGrasa / 100)
  const rmr = 370 + 21.6 * masaMagraKg
  const caloriasMantenimiento = rmr * ADVANCED_ACTIVITY_FACTORS[input.nivelActividad]

  return { masaMagraKg, caloriasMantenimiento }
}

function resolveObjectiveCalories(
  caloriasMantenimiento: number,
  objetivo: ObjetivoNutricional,
  intensidadObjetivo: IntensidadObjetivo | null | undefined,
  observaciones: string[],
): { caloriasObjetivo: number; intensidadObjetivoAplicada?: IntensidadObjetivo } {
  if (objetivo === ObjetivosNutricionales.MANTENIMIENTO) {
    return { caloriasObjetivo: caloriasMantenimiento }
  }

  const intensidad = intensidadObjetivo ?? DEFAULT_INTENSITY

  if (!intensidadObjetivo && objetivo === ObjetivosNutricionales.DEFINICION) {
    observaciones.push('Se aplicó déficit moderado por defecto')
  }

  if (!intensidadObjetivo && objetivo === ObjetivosNutricionales.VOLUMEN) {
    observaciones.push('Se aplicó superávit moderado por defecto')
  }

  if (objetivo === ObjetivosNutricionales.DEFINICION) {
    return {
      caloriasObjetivo: caloriasMantenimiento * (1 - DEFICIT_BY_INTENSITY[intensidad]),
      intensidadObjetivoAplicada: intensidad,
    }
  }

  return {
    caloriasObjetivo: caloriasMantenimiento * (1 + SURPLUS_BY_INTENSITY[intensidad]),
    intensidadObjetivoAplicada: intensidad,
  }
}

function calculateMacros(params: {
  caloriasObjetivo: number
  pesoKg: number
  objetivo: ObjetivoNutricional
  observaciones: string[]
  advertencias: string[]
}) {
  const proteinaGramos = params.pesoKg * PROTEIN_GRAMS_PER_KG[params.objetivo]
  let grasaPct = FAT_PERCENT_BY_GOAL[params.objetivo]
  let grasaGramos = (params.caloriasObjetivo * grasaPct) / 9
  let proteinaKcal = proteinaGramos * 4
  let grasaKcal = grasaGramos * 9
  let carbohidratosKcal = params.caloriasObjetivo - proteinaKcal - grasaKcal

  if (carbohidratosKcal < 0 && grasaPct > 0.2) {
    grasaPct = 0.2
    grasaGramos = (params.caloriasObjetivo * grasaPct) / 9
    grasaKcal = grasaGramos * 9
    carbohidratosKcal = params.caloriasObjetivo - proteinaKcal - grasaKcal
    params.observaciones.push('Los carbohidratos quedaron muy bajos; se redujo grasa al 20% de calorías')
  }

  if (carbohidratosKcal < 0) {
    params.advertencias.push('Los carbohidratos quedaron muy bajos; revisar configuración')
  }

  const roundedProteinaGramos = roundInteger(proteinaGramos)
  const roundedGrasaGramos = roundInteger(grasaGramos)
  const roundedProteinaKcal = roundedProteinaGramos * 4
  const roundedGrasaKcal = roundedGrasaGramos * 9
  const roundedCarbohidratosKcal = roundInteger(params.caloriasObjetivo - roundedProteinaKcal - roundedGrasaKcal)
  const roundedCarbohidratosGramos = roundInteger(roundedCarbohidratosKcal / 4)

  proteinaKcal = roundedProteinaKcal
  grasaKcal = roundedGrasaKcal
  carbohidratosKcal = roundedCarbohidratosKcal

  return {
    proteinaGramos: roundedProteinaGramos,
    grasaGramos: roundedGrasaGramos,
    carbohidratosGramos: roundedCarbohidratosGramos,
    proteinaKcal,
    grasaKcal,
    carbohidratosKcal,
  }
}

export function calcularCaloriasYMacronutrientes(input: CalculoNutricionalInput): CalculoNutricionalResultado {
  assertValidInput(input)

  const observaciones: string[] = []
  const advertencias: string[] = []
  const porcentajeGrasaValido = input.porcentajeGrasa != null

  let masaMagraKg: number | undefined
  let caloriasMantenimiento: number
  const modoUsado = porcentajeGrasaValido ? ModosCalculoNutricional.AVANZADO : ModosCalculoNutricional.ESTANDAR

  if (modoUsado === ModosCalculoNutricional.AVANZADO) {
    const advancedResult = calculateAdvancedMaintenance(input, input.porcentajeGrasa as number)
    masaMagraKg = advancedResult.masaMagraKg
    caloriasMantenimiento = advancedResult.caloriasMantenimiento
    observaciones.push('Se usó modo avanzado por disponibilidad de porcentaje de grasa')
  } else {
    caloriasMantenimiento = calculateEerMaintenance(input)
    observaciones.push('Se usó modo estándar por ausencia de porcentaje de grasa')
  }

  const roundedMaintenanceCalories = roundInteger(caloriasMantenimiento)
  const objectiveResult = resolveObjectiveCalories(
    roundedMaintenanceCalories,
    input.objetivo,
    input.intensidadObjetivo,
    observaciones,
  )
  const caloriasObjetivo = roundInteger(objectiveResult.caloriasObjetivo)
  const macros = calculateMacros({
    caloriasObjetivo,
    pesoKg: input.pesoKg,
    objetivo: input.objetivo,
    observaciones,
    advertencias,
  })

  const caloriasRecalculadas = macros.proteinaKcal + macros.carbohidratosGramos * 4 + macros.grasaKcal

  return {
    modoUsado,
    objetivo: input.objetivo,
    intensidadObjetivoAplicada: objectiveResult.intensidadObjetivoAplicada,
    caloriasMantenimiento: roundedMaintenanceCalories,
    caloriasObjetivo,
    proteinaGramos: macros.proteinaGramos,
    carbohidratosGramos: macros.carbohidratosGramos,
    grasaGramos: macros.grasaGramos,
    proteinaKcal: macros.proteinaKcal,
    carbohidratosKcal: macros.carbohidratosGramos * 4,
    grasaKcal: macros.grasaKcal,
    masaMagraKg: masaMagraKg == null ? undefined : roundInteger(masaMagraKg),
    observaciones,
    advertencias,
    caloriasRecalculadas,
  }
}
