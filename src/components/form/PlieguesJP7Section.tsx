import type { StudyFormErrors, StudyFormRegister } from './types'
import { FormField } from '../../shared/ui/FormField'

type Props = {
  register: StudyFormRegister
  errors: StudyFormErrors
}

export function PlieguesJP7Section({ register, errors }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Pliegues Jackson & Pollock (7)</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FormField label="Pectoral (mm)" name="plieguesJP7.pectoralMm" register={register} errors={errors} />
        <FormField label="Axilar media (mm)" name="plieguesJP7.axilarMediaMm" register={register} errors={errors} />
        <FormField label="Triceps (mm)" name="plieguesJP7.tricepsMm" register={register} errors={errors} />
        <FormField label="Subescapular (mm)" name="plieguesJP7.subescapularMm" register={register} errors={errors} />
        <FormField label="Abdominal (mm)" name="plieguesJP7.abdominalMm" register={register} errors={errors} />
        <FormField label="Suprailiaco (mm)" name="plieguesJP7.suprailiacoMm" register={register} errors={errors} />
        <FormField label="Muslo anterior (mm)" name="plieguesJP7.musloAnteriorMm" register={register} errors={errors} />
      </div>
    </section>
  )
}
