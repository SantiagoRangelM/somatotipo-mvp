import type { EstudioSomatotipoInput } from '../../domain/EstudioSomatotipoInput'
import type { EstudioSomatotipoResultado } from '../../domain/EstudioSomatotipoResultado'
import { calculateEndomorfia, calculateEctomorfia, calculateMesomorfia } from '../../services/formulas/heathCarter'
import { calculateImc, classifyImc } from '../../services/formulas/imc'
import { calculateBodyDensityJP7, sumJp7Skinfolds } from '../../services/formulas/jp7'
import { calculateIce, calculateIcc, classifyIcc, classifyIce } from '../../services/formulas/risk'
import { calculateBodyFatPercentBySiri } from '../../services/formulas/siri'
import { calculateSomatocarta } from '../../services/formulas/somatocarta'
import { calculateBodyWaterByWatson } from '../../services/formulas/watson'
import { round } from '../../shared/utils/number'
import { normalizeStudyInput } from '../normalization/normalizeStudyInput'
import { estudioSomatotipoSchema } from '../validation/estudioSomatotipoSchema'

function buildInterpretacionGeneral(params: {
  imc: number
  clasificacionImc: string
  porcentajeGrasa: number
  riesgoCardiovascular: string
  clasificacionIce: string
  endomorfia: number
  mesomorfia: number
  ectomorfia: number
}): string {
  const dominant = [
    { id: 'endomorfo', value: params.endomorfia },
    { id: 'mesomorfo', value: params.mesomorfia },
    { id: 'ectomorfo', value: params.ectomorfia },
  ].sort((a, b) => b.value - a.value)[0]

  const grasaLabel =
    params.porcentajeGrasa < 14
      ? 'bajo'
      : params.porcentajeGrasa < 24
        ? 'moderado'
        : 'elevado'

  return [
    `IMC ${round(params.imc, 1)} (${params.clasificacionImc}).`,
    `Porcentaje de grasa ${grasaLabel} (${round(params.porcentajeGrasa, 1)}%).`,
    `${params.riesgoCardiovascular} y ${params.clasificacionIce}.`,
    `Componente somatotípico dominante: ${dominant.id}.`,
  ].join(' ')
}

export function calculateStudy(rawInput: unknown): EstudioSomatotipoResultado {
  // 1. Validacion
  const validated = estudioSomatotipoSchema.parse(rawInput) as EstudioSomatotipoInput

  // 2. Normalizacion
  const input = normalizeStudyInput(validated)

  // 3. IMC
  const imc = calculateImc(input.pesoKg, input.tallaCm)
  const clasificacionImc = classifyImc(imc)

  // 4. ICC
  const indiceCinturaCadera = calculateIcc(input.perimetros.cinturaCm, input.perimetros.caderaCm)
  const riesgoCardiovascular = classifyIcc(input.sexo, indiceCinturaCadera)

  // 5. ICE
  const indiceCinturaEstatura = calculateIce(input.perimetros.cinturaCm, input.tallaCm)
  const clasificacionIce = classifyIce(indiceCinturaEstatura)

  // 6. Suma pliegues
  const sumaPliegues = sumJp7Skinfolds(input.plieguesJP7)

  // 7. Densidad corporal (JP7)
  const densidadCorporal = calculateBodyDensityJP7(input.sexo, sumaPliegues, input.edad)

  // 8. % grasa (Siri)
  const porcentajeGrasa = calculateBodyFatPercentBySiri(densidadCorporal)

  // 9. Masa grasa
  const masaGrasaKg = input.pesoKg * (porcentajeGrasa / 100)

  // 10. Masa magra
  const masaMagraKg = input.pesoKg - masaGrasaKg

  // 11. Agua corporal (Watson)
  const aguaCorporalKg = calculateBodyWaterByWatson({
    sexo: input.sexo,
    edad: input.edad,
    tallaCm: input.tallaCm,
    pesoKg: input.pesoKg,
  })

  // 12. Endomorfia
  const endomorfia = calculateEndomorfia({
    tallaCm: input.tallaCm,
    tricepsMm: input.plieguesJP7.tricepsMm,
    subescapularMm: input.plieguesJP7.subescapularMm,
    supraspinaleMm: input.plieguesHeathCarter.supraspinaleMm,
  })

  // 13. Mesomorfia
  const mesomorfia = calculateMesomorfia({
    tallaCm: input.tallaCm,
    humeroBiepicondilarCm: input.diametrosOseos.humeroBiepicondilarCm,
    femurBicondilarCm: input.diametrosOseos.femurBicondilarCm,
    brazoFlexionadoCm: input.perimetros.brazoFlexionadoCm,
    tricepsMm: input.plieguesJP7.tricepsMm,
    pantorrillaMaximaCm: input.perimetros.pantorrillaMaximaCm,
    pantorrillaMedialMm: input.plieguesHeathCarter.pantorrillaMedialMm,
  })

  // 14. Ectomorfia
  const ectomorfia = calculateEctomorfia(input.tallaCm, input.pesoKg)

  // 15. Somatocarta
  const somatocarta = calculateSomatocarta({
    endomorfia,
    mesomorfia,
    ectomorfia,
  })

  // 16. Interpretacion
  const interpretacionGeneral = buildInterpretacionGeneral({
    imc,
    clasificacionImc,
    porcentajeGrasa,
    riesgoCardiovascular,
    clasificacionIce,
    endomorfia,
    mesomorfia,
    ectomorfia,
  })

  return {
    imc: round(imc),
    clasificacionImc,
    porcentajeGrasa: round(porcentajeGrasa),
    masaGrasaKg: round(masaGrasaKg),
    masaMagraKg: round(masaMagraKg),
    densidadCorporal: round(densidadCorporal, 4),
    aguaCorporalKg: round(aguaCorporalKg),
    indiceCinturaCadera: round(indiceCinturaCadera),
    indiceCinturaEstatura: round(indiceCinturaEstatura),
    riesgoCardiovascular,
    somatotipo: {
      endomorfia: round(endomorfia),
      mesomorfia: round(mesomorfia),
      ectomorfia: round(ectomorfia),
    },
    somatocarta: {
      x: round(somatocarta.x),
      y: round(somatocarta.y),
    },
    interpretacionGeneral,
  }
}
