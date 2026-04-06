import { z } from 'zod'

export const calculoNutricionalSchema = z.object({
  sexo: z.enum(['HOMBRE', 'MUJER'], { error: 'El sexo es obligatorio' }),
  edad: z.coerce.number().gt(0, 'La edad debe ser mayor que cero'),
  pesoKg: z.coerce.number().gt(0, 'El peso debe ser mayor que cero'),
  tallaCm: z.coerce.number().gt(0, 'La talla debe ser mayor que cero'),
  nivelActividad: z.enum(['INACTIVO', 'POCO_ACTIVO', 'ACTIVO', 'MUY_ACTIVO'], {
    error: 'El nivel de actividad es obligatorio',
  }),
  objetivo: z.enum(['MANTENIMIENTO', 'DEFINICION', 'VOLUMEN'], {
    error: 'El objetivo nutricional es obligatorio',
  }),
  porcentajeGrasa: z.preprocess(
    (value) => (value === '' || value == null ? undefined : value),
    z.coerce.number().min(2, 'El porcentaje de grasa debe ser mayor o igual a 2').max(70, 'El porcentaje de grasa debe ser menor o igual a 70').optional(),
  ),
  intensidadObjetivo: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.enum(['LEVE', 'MODERADO', 'ALTO']).nullish(),
  ),
})

export type CalculoNutricionalFormInput = z.input<typeof calculoNutricionalSchema>
export type CalculoNutricionalFormOutput = z.output<typeof calculoNutricionalSchema>
