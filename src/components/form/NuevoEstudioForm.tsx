import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  estudioSomatotipoSchema,
  type EstudioSomatotipoFormInput,
  type EstudioSomatotipoFormOutput,
} from '../../application/validation/estudioSomatotipoSchema'
import type { EstudioSomatotipoInput } from '../../domain/EstudioSomatotipoInput'
import { DatosBasicosSection } from './DatosBasicosSection'
import { DiametrosSection } from './DiametrosSection'
import { PerimetrosSection } from './PerimetrosSection'
import { PlieguesHeathCarterSection } from './PlieguesHeathCarterSection'
import { PlieguesJP7Section } from './PlieguesJP7Section'

type Props = {
  onSubmit: (data: EstudioSomatotipoInput) => void
}

const defaults: EstudioSomatotipoFormInput = {
  nombrePersona: '',
  fechaEvaluacion: '',
  sexo: 'M',
  edad: 0,
  pesoKg: 0,
  tallaCm: 0,
  perimetros: {
    cinturaCm: 0,
    caderaCm: 0,
    brazoFlexionadoCm: 0,
    pantorrillaMaximaCm: 0,
  },
  diametrosOseos: {
    humeroBiepicondilarCm: 0,
    femurBicondilarCm: 0,
  },
  plieguesJP7: {
    pectoralMm: 0,
    axilarMediaMm: 0,
    tricepsMm: 0,
    subescapularMm: 0,
    abdominalMm: 0,
    suprailiacoMm: 0,
    musloAnteriorMm: 0,
  },
  plieguesHeathCarter: {
    supraspinaleMm: 0,
    pantorrillaMedialMm: 0,
  },
}

export function NuevoEstudioForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<EstudioSomatotipoFormInput, unknown, EstudioSomatotipoFormOutput>({
    resolver: zodResolver(estudioSomatotipoSchema),
    mode: 'onChange',
    defaultValues: defaults,
  })

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)} noValidate>
      <DatosBasicosSection register={register} errors={errors} />
      <PerimetrosSection register={register} errors={errors} />
      <DiametrosSection register={register} errors={errors} />
      <PlieguesJP7Section register={register} errors={errors} />
      <PlieguesHeathCarterSection register={register} errors={errors} />

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        Calcular estudio
      </button>
    </form>
  )
}
