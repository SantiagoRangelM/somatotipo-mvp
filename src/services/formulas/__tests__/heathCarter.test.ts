import { describe, expect, it } from 'vitest'

import { calculateEctomorfia, calculateEndomorfia, calculateMesomorfia } from '../heathCarter'

describe('heath-carter', () => {
  it('calcula endomorfia', () => {
    const endo = calculateEndomorfia({
      tallaCm: 175,
      tricepsMm: 14,
      subescapularMm: 11,
      supraspinaleMm: 13,
    })

    expect(endo).toBeCloseTo(3.79, 2)
  })

  it('calcula mesomorfia', () => {
    const meso = calculateMesomorfia({
      tallaCm: 175,
      humeroBiepicondilarCm: 7,
      femurBicondilarCm: 9.5,
      brazoFlexionadoCm: 32,
      tricepsMm: 14,
      pantorrillaMaximaCm: 37,
      pantorrillaMedialMm: 12,
    })

    expect(meso).toBeCloseTo(4.81, 2)
  })

  it('calcula ectomorfia', () => {
    const ecto = calculateEctomorfia(175, 70)
    expect(ecto).toBeCloseTo(2.5, 1)
  })
})
