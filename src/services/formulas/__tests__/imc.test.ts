import { describe, expect, it } from 'vitest'

import { calculateImc } from '../imc'

describe('calculateImc', () => {
  it('calcula IMC correctamente', () => {
    expect(calculateImc(70, 175)).toBeCloseTo(22.8571, 4)
  })
})
