import { useNavigate } from 'react-router-dom'

import { calculateStudy } from '../application/use-cases/calculateStudy'
import { NuevoEstudioForm } from '../components/form/NuevoEstudioForm'
import type { EstudioSomatotipoInput } from '../domain/EstudioSomatotipoInput'
import { saveStudySession } from '../infrastructure/session/studySessionStore'

export function NuevoEstudioPage() {
  const navigate = useNavigate()

  const handleSubmit = (input: EstudioSomatotipoInput) => {
    const resultado = calculateStudy(input)
    saveStudySession({ input, resultado })
    navigate('/resultado')
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Nuevo estudio antropometrico</h1>
        <p className="mt-2 text-sm text-slate-600">Todos los campos son obligatorios y deben ser mayores que cero.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <NuevoEstudioForm onSubmit={handleSubmit} />
      </section>
    </main>
  )
}
