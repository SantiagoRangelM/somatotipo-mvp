import { describe, expect, it } from 'vitest'

import { calcularCaloriasYMacronutrientes } from '../nutritionCalculator'

describe('calcularCaloriasYMacronutrientes', () => {
  it('calcula mantenimiento en modo estandar con ecuacion EER', () => {
    const result = calcularCaloriasYMacronutrientes({
      sexo: 'HOMBRE',
      edad: 30,
      pesoKg: 70,
      tallaCm: 175,
      nivelActividad: 'ACTIVO',
      objetivo: 'MANTENIMIENTO',
    })

    expect(result.modoUsado).toBe('ESTANDAR')
    expect(result.caloriasMantenimiento).toBe(2935)
    expect(result.caloriasObjetivo).toBe(2935)
    expect(result.proteinaGramos).toBe(126)
    expect(result.grasaGramos).toBe(98)
    expect(result.carbohidratosGramos).toBe(387)
    expect(result.masaMagraKg).toBeUndefined()
    expect(result.observaciones).toContain('Se usó modo estándar por ausencia de porcentaje de grasa')
  })

  it('calcula definicion en modo avanzado y aplica deficit moderado por defecto', () => {
    const result = calcularCaloriasYMacronutrientes({
      sexo: 'MUJER',
      edad: 34,
      pesoKg: 65,
      tallaCm: 168,
      nivelActividad: 'POCO_ACTIVO',
      objetivo: 'DEFINICION',
      porcentajeGrasa: 28,
    })

    expect(result.modoUsado).toBe('AVANZADO')
    expect(result.masaMagraKg).toBe(47)
    expect(result.caloriasMantenimiento).toBe(1899)
    expect(result.caloriasObjetivo).toBe(1614)
    expect(result.proteinaGramos).toBe(143)
    expect(result.grasaGramos).toBe(45)
    expect(result.carbohidratosGramos).toBe(159)
    expect(result.observaciones).toContain('Se usó modo avanzado por disponibilidad de porcentaje de grasa')
    expect(result.observaciones).toContain('Se aplicó déficit moderado por defecto')
  })

  it('calcula volumen en modo avanzado con superavit alto explicito', () => {
    const result = calcularCaloriasYMacronutrientes({
      sexo: 'HOMBRE',
      edad: 29,
      pesoKg: 80,
      tallaCm: 180,
      nivelActividad: 'ACTIVO',
      objetivo: 'VOLUMEN',
      intensidadObjetivo: 'ALTO',
      porcentajeGrasa: 15,
    })

    expect(result.modoUsado).toBe('AVANZADO')
    expect(result.caloriasMantenimiento).toBe(2850)
    expect(result.caloriasObjetivo).toBe(3277)
    expect(result.proteinaGramos).toBe(144)
    expect(result.grasaGramos).toBe(91)
    expect(result.carbohidratosGramos).toBe(471)
    expect(result.observaciones).not.toContain('Se aplicó superávit moderado por defecto')
  })

  it('rechaza porcentaje de grasa fuera de rango', () => {
    expect(() =>
      calcularCaloriasYMacronutrientes({
        sexo: 'HOMBRE',
        edad: 30,
        pesoKg: 80,
        tallaCm: 180,
        nivelActividad: 'ACTIVO',
        objetivo: 'MANTENIMIENTO',
        porcentajeGrasa: 90,
      }),
    ).toThrow('porcentajeGrasa debe estar entre 2 y 70')
  })

  it('advierte cuando los carbohidratos quedan negativos incluso bajando grasa al 20%', () => {
    const result = calcularCaloriasYMacronutrientes({
      sexo: 'HOMBRE',
      edad: 40,
      pesoKg: 200,
      tallaCm: 170,
      nivelActividad: 'INACTIVO',
      objetivo: 'DEFINICION',
      intensidadObjetivo: 'ALTO',
      porcentajeGrasa: 70,
    })

    expect(result.carbohidratosGramos).toBeLessThan(0)
    expect(result.observaciones).toContain('Los carbohidratos quedaron muy bajos; se redujo grasa al 20% de calorías')
    expect(result.advertencias).toContain('Los carbohidratos quedaron muy bajos; revisar configuración')
  })
})
