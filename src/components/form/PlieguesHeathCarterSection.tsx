import type { StudyFormErrors, StudyFormRegister } from './types'
import { FormField } from '../../shared/ui/FormField'

type Props = {
  register: StudyFormRegister
  errors: StudyFormErrors
}

export function PlieguesHeathCarterSection({ register, errors }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Pliegues Heath-Carter</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Supraspinale (mm)"
          name="plieguesHeathCarter.supraspinaleMm"
          register={register}
          errors={errors}
        />
        <FormField
          label="Pantorrilla medial (mm)"
          name="plieguesHeathCarter.pantorrillaMedialMm"
          register={register}
          errors={errors}
        />
      </div>
    </section>
  )
}
