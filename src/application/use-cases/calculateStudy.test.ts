import { describe, expect, it } from 'vitest'

import { calculateStudy } from './calculateStudy'

describe('calculateStudy', () => {
  it('normaliza talla en metros y entrega IMC correcto', () => {
    const result = calculateStudy({
      nombrePersona: 'Test',
      fechaEvaluacion: '2026-03-21',
      sexo: 'M',
      edad: 30,
      pesoKg: 70.7,
      tallaCm: 1.63,
      perimetros: {
        cinturaCm: 85,
        caderaCm: 95,
        brazoFlexionadoCm: 32,
        pantorrillaMaximaCm: 37,
      },
      diametrosOseos: {
        humeroBiepicondilarCm: 7,
        femurBicondilarCm: 9.5,
      },
      plieguesJP7: {
        pectoralMm: 12,
        axilarMediaMm: 10,
        tricepsMm: 14,
        subescapularMm: 11,
        abdominalMm: 20,
        suprailiacoMm: 13,
        musloAnteriorMm: 18,
      },
      plieguesHeathCarter: {
        supraspinaleMm: 13,
        pantorrillaMedialMm: 12,
      },
    })

    expect(result.imc).toBeCloseTo(26.61, 2)
  })
})
