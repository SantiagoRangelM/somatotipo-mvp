import { Link } from 'react-router-dom'

import { ComposicionChart } from '../components/results/ComposicionChart'
import { ResultadosTable } from '../components/results/ResultadosTable'
import { SomatocartaChart } from '../components/results/SomatocartaChart'
import { SomatotipoProfile } from '../components/results/SomatotipoProfile'
import { readStudySession } from '../infrastructure/session/studySessionStore'
import { exportStudyPdf } from '../services/pdf/exportStudyPdf'

export function ResultadoPage() {
  const session = readStudySession()

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">No hay resultados cargados</h1>
          <p className="mt-2 text-sm text-slate-600">Primero registra un estudio para generar calculos y visualizaciones.</p>
          <Link
            to="/nuevo"
            className="mt-6 inline-block rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Ir a nuevo estudio
          </Link>
        </section>
      </main>
    )
  }

  const { input, resultado } = session

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Resultado del estudio</h1>
          <p className="mt-2 text-sm text-slate-600">
            {input.nombrePersona} · {input.fechaEvaluacion} · Sexo {input.sexo} · {input.edad} años
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportStudyPdf(session)}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          Exportar PDF
        </button>
      </header>

      <section className="space-y-6">
        <ResultadosTable resultado={resultado} />

        <div className="grid gap-6 lg:grid-cols-2">
          <ComposicionChart resultado={resultado} />
          <SomatotipoProfile resultado={resultado} />
        </div>

        <SomatocartaChart resultado={resultado} />

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">Interpretacion general</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{resultado.interpretacionGeneral}</p>
        </article>
      </section>
    </main>
  )
}
