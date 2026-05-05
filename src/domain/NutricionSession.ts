import type { CalculoNutricionalInput, CalculoNutricionalResultado } from '../services/nutrition/types'

export type NutricionSession = {
  input: CalculoNutricionalInput
  resultado: CalculoNutricionalResultado
  origen: 'MANUAL' | 'ESTUDIO_ANTROPOMETRICO'
}
