import type { StudyFormErrors, StudyFormRegister } from './types'
import { FormField } from '../../shared/ui/FormField'

type Props = {
  register: StudyFormRegister
  errors: StudyFormErrors
}

export function PerimetrosSection({ register, errors }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Perimetros</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Cintura (cm)" name="perimetros.cinturaCm" register={register} errors={errors} />
        <FormField label="Cadera (cm)" name="perimetros.caderaCm" register={register} errors={errors} />
        <FormField label="Brazo flexionado (cm)" name="perimetros.brazoFlexionadoCm" register={register} errors={errors} />
        <FormField label="Pantorrilla maxima (cm)" name="perimetros.pantorrillaMaximaCm" register={register} errors={errors} />
      </div>
    </section>
  )
}
