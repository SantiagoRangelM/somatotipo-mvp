import { describe, expect, it } from 'vitest'

import { calculateBodyFatPercentBySiri } from '../siri'

describe('siri', () => {
  it('calcula porcentaje de grasa', () => {
    expect(calculateBodyFatPercentBySiri(1.0534)).toBeCloseTo(19.91, 2)
  })
})
