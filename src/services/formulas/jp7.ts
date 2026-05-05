import type { SexoBiologico } from '../../domain/EstudioSomatotipoInput'

export function sumJp7Skinfolds(variables: {
  pectoralMm: number
  axilarMediaMm: number
  tricepsMm: number
  subescapularMm: number
  abdominalMm: number
  suprailiacoMm: number
  musloAnteriorMm: number
}): number {
  return (
    variables.pectoralMm +
    variables.axilarMediaMm +
    variables.tricepsMm +
    variables.subescapularMm +
    variables.abdominalMm +
    variables.suprailiacoMm +
    variables.musloAnteriorMm
  )
}

export function calculateBodyDensityJP7(sexo: SexoBiologico, sumPliegues: number, edad: number): number {
  const squared = sumPliegues * sumPliegues

  if (sexo === 'M') {
    return 1.112 - 0.00043499 * sumPliegues + 0.00000055 * squared - 0.00028826 * edad
  }

  return 1.097 - 0.00046971 * sumPliegues + 0.00000056 * squared - 0.00012828 * edad
}
