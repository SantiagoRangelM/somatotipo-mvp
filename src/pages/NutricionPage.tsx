import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { FieldErrors, Path, UseFormRegister } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import {
  calculoNutricionalSchema,
  type CalculoNutricionalFormInput,
  type CalculoNutricionalFormOutput,
} from '../application/validation/calculoNutricionalSchema'
import { NutricionResultadoCard } from '../components/results/NutricionResultadoCard'
import type { NutricionSession } from '../domain/NutricionSession'
import { readNutritionSession, saveNutritionSession } from '../infrastructure/session/nutritionSessionStore'
import { readStudySession } from '../infrastructure/session/studySessionStore'
import { calcularCaloriasYMacronutrientes } from '../services/nutrition/nutritionCalculator'
import { exportNutritionPrescriptionPdf } from '../services/pdf/exportNutritionPrescriptionPdf'
import type { CalculoNutricionalInput, CalculoNutricionalResultado } from '../services/nutrition/types'

type NutritionRegister = UseFormRegister<CalculoNutricionalFormInput>
type NutritionErrors = FieldErrors<CalculoNutricionalFormInput>

const emptyDefaults: CalculoNutricionalFormInput = {
  sexo: 'HOMBRE',
  edad: undefined,
  pesoKg: undefined,
  tallaCm: undefined,
  nivelActividad: 'ACTIVO',
  objetivo: 'MANTENIMIENTO',
  porcentajeGrasa: undefined,
  intensidadObjetivo: undefined,
}

function normalizeHeightCm(rawHeight: number): number {
  return rawHeight > 0 && rawHeight <= 3 ? rawHeight * 100 : rawHeight
}

function errorByPath(errors: NutritionErrors, name: Path<CalculoNutricionalFormInput>): string | null {
  const keys = name.split('.')
  let current: unknown = errors

  for (const key of keys) {
    if (typeof current !== 'object' || current === null || !(key in current)) return null
    current = (current as Record<string, unknown>)[key]
  }

  if (typeof current === 'object' && current !== null && 'message' in current) {
    const message = (current as { message?: unknown }).message
    return typeof message === 'string' ? message : null
  }

  return null
}

function NumberField({
  label,
  name,
  register,
  errors,
  step = '0.1',
}: {
  label: string
  name: Path<CalculoNutricionalFormInput>
  register: NutritionRegister
  errors: NutritionErrors
  step?: string
}) {
  const message = errorByPath(errors, name)

  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">{label}</span>
      <input
        type="number"
        step={step}
        className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
        {...register(name)}
      />
      {message ? <span className="text-xs text-rose-600">{message}</span> : null}
    </label>
  )
}

function SelectField({
  label,
  name,
  register,
  errors,
  children,
}: {
  label: string
  name: Path<CalculoNutricionalFormInput>
  register: NutritionRegister
  errors: NutritionErrors
  children: ReactNode
}) {
  const message = errorByPath(errors, name)

  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">{label}</span>
      <select
        className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
        {...register(name)}
      >
        {children}
      </select>
      {message ? <span className="text-xs text-rose-600">{message}</span> : null}
    </label>
  )
}

function buildDefaultsFromStudy(): CalculoNutricionalFormInput | null {
  const studySession = readStudySession()
  if (!studySession) return null

  return {
    sexo: studySession.input.sexo === 'M' ? 'HOMBRE' : 'MUJER',
    edad: studySession.input.edad,
    pesoKg: studySession.input.pesoKg,
    tallaCm: normalizeHeightCm(studySession.input.tallaCm),
    nivelActividad: 'ACTIVO',
    objetivo: 'MANTENIMIENTO',
    porcentajeGrasa: studySession.resultado.porcentajeGrasa,
    intensidadObjetivo: undefined,
  }
}

function buildInitialState(fromStudy: boolean): { defaults: CalculoNutricionalFormInput; result: CalculoNutricionalResultado | null } {
  const studyDefaults = fromStudy ? buildDefaultsFromStudy() : null
  if (studyDefaults) return { defaults: studyDefaults, result: null }

  const nutritionSession = readNutritionSession()
  if (nutritionSession) {
    return {
      defaults: {
        sexo: nutritionSession.input.sexo,
        edad: nutritionSession.input.edad,
        pesoKg: nutritionSession.input.pesoKg,
        tallaCm: nutritionSession.input.tallaCm,
        nivelActividad: nutritionSession.input.nivelActividad,
        objetivo: nutritionSession.input.objetivo,
        porcentajeGrasa: nutritionSession.input.porcentajeGrasa ?? undefined,
        intensidadObjetivo: nutritionSession.input.intensidadObjetivo ?? undefined,
      },
      result: nutritionSession.resultado,
    }
  }

  return { defaults: emptyDefaults, result: null }
}

export function NutricionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromStudy = searchParams.get('desde') === 'estudio'
  const prescriptionRef = useRef<HTMLDivElement | null>(null)
  const [initialState] = useState(() => buildInitialState(fromStudy))
  const [resultado, setResultado] = useState<CalculoNutricionalResultado | null>(initialState.result)
  const [session, setSession] = useState<NutricionSession | null>(() => {
    if (!initialState.result) return null

    return readNutritionSession()
  })
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CalculoNutricionalFormInput, unknown, CalculoNutricionalFormOutput>({
    resolver: zodResolver(calculoNutricionalSchema),
    mode: 'onChange',
    defaultValues: initialState.defaults,
  })

  const onSubmit = (data: CalculoNutricionalFormOutput) => {
    const input: CalculoNutricionalInput = {
      ...data,
      tallaCm: normalizeHeightCm(data.tallaCm),
      porcentajeGrasa: data.porcentajeGrasa ?? null,
      intensidadObjetivo: data.intensidadObjetivo ?? null,
    }
    const nextResult = calcularCaloriasYMacronutrientes(input)
    const session: NutricionSession = {
      input,
      resultado: nextResult,
      origen: fromStudy ? 'ESTUDIO_ANTROPOMETRICO' : 'MANUAL',
    }

    saveNutritionSession(session)
    setResultado(nextResult)
    setSession(session)
  }

  const handleExportPdf = async () => {
    if (!session || !prescriptionRef.current || isExportingPdf) return

    try {
      setIsExportingPdf(true)
      await exportNutritionPrescriptionPdf(session, prescriptionRef.current)
    } catch (error) {
      console.error('No se pudo exportar la prescripcion nutricional en PDF', error)
      window.alert('No se pudo generar el PDF. Intentalo nuevamente.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
              aria-label="Volver atras"
              title="Volver atras"
            >
              ←
            </button>
            <h1 className="text-3xl font-black text-slate-900">Calculo calorico y macronutrientes</h1>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Modulo independiente para mantenimiento, definicion o volumen. Si vienes desde el informe antropometrico,
            los datos corporales se precargan automaticamente.
          </p>
        </div>
        <Link
          to="/"
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Inicio
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Datos de entrada</p>
              <h2 className="mt-2 text-xl font-black text-slate-900">Prescripcion nutricional</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField label="Sexo" name="sexo" register={register} errors={errors}>
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
              </SelectField>
              <NumberField label="Edad" name="edad" register={register} errors={errors} step="1" />
              <NumberField label="Peso (kg)" name="pesoKg" register={register} errors={errors} />
              <NumberField label="Talla (cm o m)" name="tallaCm" register={register} errors={errors} />
              <SelectField label="Nivel de actividad" name="nivelActividad" register={register} errors={errors}>
                <option value="INACTIVO">Inactivo</option>
                <option value="POCO_ACTIVO">Poco activo</option>
                <option value="ACTIVO">Activo</option>
                <option value="MUY_ACTIVO">Muy activo</option>
              </SelectField>
              <SelectField label="Objetivo" name="objetivo" register={register} errors={errors}>
                <option value="MANTENIMIENTO">Mantenimiento</option>
                <option value="DEFINICION">Definicion</option>
                <option value="VOLUMEN">Volumen</option>
              </SelectField>
              <NumberField label="% grasa opcional" name="porcentajeGrasa" register={register} errors={errors} />
              <SelectField label="Intensidad" name="intensidadObjetivo" register={register} errors={errors}>
                <option value="">Moderado por defecto</option>
                <option value="LEVE">Leve</option>
                <option value="MODERADO">Moderado</option>
                <option value="ALTO">Alto</option>
              </SelectField>
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Calcular nutricion
            </button>
          </form>
        </section>

        <section className="space-y-4">
          {resultado ? (
            <>
              <div className="flex justify-end">
                <button
                  data-pdf-ignore="true"
                  type="button"
                  onClick={() => void handleExportPdf()}
                  disabled={!session || isExportingPdf}
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {isExportingPdf ? 'Generando PDF...' : 'Exportar PDF'}
                </button>
              </div>
              <div ref={prescriptionRef}>
                <NutricionResultadoCard nutricion={resultado} />
              </div>
            </>
          ) : (
            <article className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sin calculo aun</p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">Completa los datos y ejecuta el calculo</h2>
              <p className="mt-3 text-sm text-slate-600">
                Con porcentaje de grasa valido se usa Katch-McArdle; sin ese dato se usa EER adulto.
              </p>
            </article>
          )}
        </section>
      </div>
    </main>
  )
}
