import type { EstudioSomatotipoInput } from '../../domain/EstudioSomatotipoInput'

function normalizeHeightCm(rawHeight: number): number {
  // Permite entrada en metros (1.63) o centimetros (163)
  if (rawHeight > 0 && rawHeight <= 3) {
    return rawHeight * 100
  }

  return rawHeight
}

export function normalizeStudyInput(input: EstudioSomatotipoInput): EstudioSomatotipoInput {
  return {
    ...input,
    nombrePersona: input.nombrePersona.trim(),
    fechaEvaluacion: new Date(input.fechaEvaluacion).toISOString().slice(0, 10),
    tallaCm: normalizeHeightCm(input.tallaCm),
  }
}
