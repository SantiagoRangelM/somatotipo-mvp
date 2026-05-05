import { z } from 'zod'

export const estudioSomatotipoSchema = z.object({
  nombrePersona: z.string().trim().min(1, 'El nombre es obligatorio'),
  fechaEvaluacion: z.string().trim().min(1, 'La fecha es obligatoria'),
  sexo: z.enum(['M', 'F'], { error: 'El sexo es obligatorio' }),
  edad: z.coerce.number().gt(0, 'La edad debe ser mayor que cero'),

  pesoKg: z.coerce.number().gt(0, 'El peso debe ser mayor que cero'),
  tallaCm: z.coerce.number().gt(0, 'La talla debe ser mayor que cero'),

  perimetros: z.object({
    cinturaCm: z.coerce.number().gt(0, 'La cintura debe ser mayor que cero'),
    caderaCm: z.coerce.number().gt(0, 'La cadera debe ser mayor que cero'),
    brazoFlexionadoCm: z.coerce.number().gt(0, 'El brazo debe ser mayor que cero'),
    pantorrillaMaximaCm: z.coerce.number().gt(0, 'La pantorrilla debe ser mayor que cero'),
  }),

  diametrosOseos: z.object({
    humeroBiepicondilarCm: z.coerce.number().gt(0, 'El húmero debe ser mayor que cero'),
    femurBicondilarCm: z.coerce.number().gt(0, 'El fémur debe ser mayor que cero'),
  }),

  plieguesJP7: z.object({
    pectoralMm: z.coerce.number().gt(0, 'Pectoral obligatorio'),
    axilarMediaMm: z.coerce.number().gt(0, 'Axilar media obligatoria'),
    tricepsMm: z.coerce.number().gt(0, 'Tríceps obligatorio'),
    subescapularMm: z.coerce.number().gt(0, 'Subescapular obligatorio'),
    abdominalMm: z.coerce.number().gt(0, 'Abdominal obligatorio'),
    suprailiacoMm: z.coerce.number().gt(0, 'Suprailiaco obligatorio'),
    musloAnteriorMm: z.coerce.number().gt(0, 'Muslo anterior obligatorio'),
  }),

  plieguesHeathCarter: z.object({
    supraspinaleMm: z.coerce.number().gt(0, 'Supraspinale obligatorio'),
    pantorrillaMedialMm: z.coerce.number().gt(0, 'Pantorrilla medial obligatoria'),
  }),
})

export type EstudioSomatotipoFormInput = z.input<typeof estudioSomatotipoSchema>
export type EstudioSomatotipoFormOutput = z.output<typeof estudioSomatotipoSchema>
