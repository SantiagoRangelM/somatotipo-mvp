import { describe, expect, it } from 'vitest'

import { calculateBodyDensityJP7, sumJp7Skinfolds } from '../jp7'

describe('jp7', () => {
  it('suma pliegues correctamente', () => {
    const sum = sumJp7Skinfolds({
      pectoralMm: 12,
      axilarMediaMm: 10,
      tricepsMm: 14,
      subescapularMm: 11,
      abdominalMm: 20,
      suprailiacoMm: 13,
      musloAnteriorMm: 18,
    })

    expect(sum).toBe(98)
  })

  it('calcula densidad corporal hombre', () => {
    const density = calculateBodyDensityJP7('M', 98, 30)
    expect(density).toBeCloseTo(1.066, 3)
  })
})
