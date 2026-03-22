import type { StudyFormErrors, StudyFormRegister } from './types'
import { FormField } from '../../shared/ui/FormField'

type Props = {
  register: StudyFormRegister
  errors: StudyFormErrors
}

export function DatosBasicosSection({ register, errors }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Datos basicos</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Nombre" name="nombrePersona" type="text" register={register} errors={errors} />
        <FormField label="Fecha de evaluacion" name="fechaEvaluacion" type="date" register={register} errors={errors} />

        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">Sexo</span>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
            {...register('sexo')}
            defaultValue=""
          >
            <option value="" disabled>
              Selecciona
            </option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          {errors.sexo?.message ? <span className="text-xs text-rose-600">{errors.sexo.message}</span> : null}
        </label>

        <FormField label="Edad" name="edad" step="1" register={register} errors={errors} />
        <FormField label="Peso (kg)" name="pesoKg" register={register} errors={errors} />
        <div>
          <FormField label="Talla (cm o m)" name="tallaCm" register={register} errors={errors} />
          <p className="mt-1 text-xs text-slate-500">Acepta 163 o 1.63 (se normaliza automaticamente).</p>
        </div>
      </div>
    </section>
  )
}
