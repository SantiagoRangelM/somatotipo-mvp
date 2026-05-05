import { describe, expect, it } from 'vitest'

import { calculateBodyWaterByWatson } from '../watson'

describe('watson', () => {
  it('calcula agua corporal en hombre', () => {
    const value = calculateBodyWaterByWatson({ sexo: 'M', edad: 30, tallaCm: 175, pesoKg: 70 })
    expect(value).toBeCloseTo(42.03, 2)
  })

  it('calcula agua corporal en mujer', () => {
    const value = calculateBodyWaterByWatson({ sexo: 'F', edad: 30, tallaCm: 165, pesoKg: 60 })
    expect(value).toBeCloseTo(30.34, 2)
  })
})
