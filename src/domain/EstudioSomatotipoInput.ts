export type SexoBiologico = 'M' | 'F'

export type EstudioSomatotipoInput = {
  nombrePersona: string
  fechaEvaluacion: string
  sexo: SexoBiologico
  edad: number

  pesoKg: number
  tallaCm: number

  perimetros: {
    cinturaCm: number
    caderaCm: number
    brazoFlexionadoCm: number
    pantorrillaMaximaCm: number
  }

  diametrosOseos: {
    humeroBiepicondilarCm: number
    femurBicondilarCm: number
  }

  plieguesJP7: {
    pectoralMm: number
    axilarMediaMm: number
    tricepsMm: number
    subescapularMm: number
    abdominalMm: number
    suprailiacoMm: number
    musloAnteriorMm: number
  }

  plieguesHeathCarter: {
    supraspinaleMm: number
    pantorrillaMedialMm: number
  }
}
