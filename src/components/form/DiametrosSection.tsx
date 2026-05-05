import type { StudyFormErrors, StudyFormRegister } from './types'
import { FormField } from '../../shared/ui/FormField'

type Props = {
  register: StudyFormRegister
  errors: StudyFormErrors
}

export function DiametrosSection({ register, errors }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Diametros oseos</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Humero biepicondilar (cm)"
          name="diametrosOseos.humeroBiepicondilarCm"
          register={register}
          errors={errors}
        />
        <FormField
          label="Femur bicondilar (cm)"
          name="diametrosOseos.femurBicondilarCm"
          register={register}
          errors={errors}
        />
      </div>
    </section>
  )
}
