import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import type {
  EstudioSomatotipoFormInput,
} from '../../application/validation/estudioSomatotipoSchema'

export type StudyFormRegister = UseFormRegister<
  EstudioSomatotipoFormInput
>

export type StudyFormErrors = FieldErrors<EstudioSomatotipoFormInput>
