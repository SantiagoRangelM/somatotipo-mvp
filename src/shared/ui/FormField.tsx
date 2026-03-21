import type { Path } from 'react-hook-form'

import type { EstudioSomatotipoFormInput } from '../../application/validation/estudioSomatotipoSchema'
import type { StudyFormErrors, StudyFormRegister } from '../../components/form/types'

type FieldProps = {
  label: string
  name: Path<EstudioSomatotipoFormInput>
  register: StudyFormRegister
  errors: StudyFormErrors
  type?: 'text' | 'date' | 'number'
  step?: string
}

function errorByPath(errors: StudyFormErrors, name: Path<EstudioSomatotipoFormInput>): string | null {
  const keys = name.split('.')
  let current: unknown = errors

  for (const key of keys) {
    if (typeof current !== 'object' || current === null || !(key in current)) {
      return null
    }
    current = (current as Record<string, unknown>)[key]
  }

  if (typeof current === 'object' && current !== null && 'message' in current) {
    const message = (current as { message?: unknown }).message
    return typeof message === 'string' ? message : null
  }

  return null
}

export function FormField({ label, name, register, errors, type = 'number', step = '0.1' }: FieldProps) {
  const message = errorByPath(errors, name)

  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">{label}</span>
      <input
        type={type}
        step={type === 'number' ? step : undefined}
        className="w-full rounded-xl border border-slate-300 bg-white/90 px-3 py-2.5 text-sm outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200"
        {...register(name)}
      />
      {message ? <span className="text-xs text-rose-600">{message}</span> : null}
    </label>
  )
}
