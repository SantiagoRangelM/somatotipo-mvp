import type { SexoBiologico } from '../../domain/EstudioSomatotipoInput'

export function calculateBodyWaterByWatson(params: {
  sexo: SexoBiologico
  edad: number
  tallaCm: number
  pesoKg: number
}): number {
  const { sexo, edad, tallaCm, pesoKg } = params

  if (sexo === 'M') {
    return 2.447 - 0.09156 * edad + 0.1074 * tallaCm + 0.3362 * pesoKg
  }

  return -2.097 + 0.1069 * tallaCm + 0.2466 * pesoKg
}
