import type { EstudioSomatotipoInput } from '../../domain/EstudioSomatotipoInput'

export function normalizeStudyInput(input: EstudioSomatotipoInput): EstudioSomatotipoInput {
  return {
    ...input,
    nombrePersona: input.nombrePersona.trim(),
    fechaEvaluacion: new Date(input.fechaEvaluacion).toISOString().slice(0, 10),
  }
}
