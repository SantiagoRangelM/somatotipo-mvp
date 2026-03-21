import type { SexoBiologico } from '../../domain/EstudioSomatotipoInput'

export function calculateIcc(cinturaCm: number, caderaCm: number): number {
  return cinturaCm / caderaCm
}

export function calculateIce(cinturaCm: number, tallaCm: number): number {
  return cinturaCm / tallaCm
}

export function classifyIcc(sexo: SexoBiologico, icc: number): string {
  if (sexo === 'M') {
    if (icc < 0.9) return 'Riesgo cardiovascular bajo'
    if (icc < 1) return 'Riesgo cardiovascular moderado'
    return 'Riesgo cardiovascular alto'
  }

  if (icc < 0.8) return 'Riesgo cardiovascular bajo'
  if (icc < 0.85) return 'Riesgo cardiovascular moderado'
  return 'Riesgo cardiovascular alto'
}

export function classifyIce(ice: number): string {
  if (ice < 0.5) return 'ICE saludable'
  if (ice < 0.6) return 'ICE elevado'
  return 'ICE muy elevado'
}
