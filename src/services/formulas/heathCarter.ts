export function calculateEndomorfia(params: {
  tallaCm: number
  tricepsMm: number
  subescapularMm: number
  supraspinaleMm: number
}): number {
  const correctedSum =
    (params.tricepsMm + params.subescapularMm + params.supraspinaleMm) * (170.18 / params.tallaCm)

  return (
    -0.7182 +
    0.1451 * correctedSum -
    0.00068 * correctedSum ** 2 +
    0.0000014 * correctedSum ** 3
  )
}

export function calculateMesomorfia(params: {
  tallaCm: number
  humeroBiepicondilarCm: number
  femurBicondilarCm: number
  brazoFlexionadoCm: number
  tricepsMm: number
  pantorrillaMaximaCm: number
  pantorrillaMedialMm: number
}): number {
  const brazoCorregidoCm = params.brazoFlexionadoCm - params.tricepsMm / 10
  const pantorrillaCorregidaCm = params.pantorrillaMaximaCm - params.pantorrillaMedialMm / 10

  return (
    0.858 * params.humeroBiepicondilarCm +
    0.601 * params.femurBicondilarCm +
    0.188 * brazoCorregidoCm +
    0.161 * pantorrillaCorregidaCm -
    0.131 * params.tallaCm +
    4.5
  )
}

export function calculateEctomorfia(tallaCm: number, pesoKg: number): number {
  const hwr = tallaCm / Math.cbrt(pesoKg)

  if (hwr > 40.75) return 0.732 * hwr - 28.58
  if (hwr > 38.25) return 0.463 * hwr - 17.63
  if (hwr >= 36.5) return 0.1
  return 0.1
}
