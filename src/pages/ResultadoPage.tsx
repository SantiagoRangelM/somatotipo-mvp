import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { ImcCard } from '../components/results/ImcCard'
import { PorcentajeGrasaBar } from '../components/results/PorcentajeGrasaBar'
import { RiesgoCardiovascularCard } from '../components/results/RiesgoCardiovascularCard'
import { SomatocartaChart } from '../components/results/SomatocartaChart'
import { SomatotipoProfile } from '../components/results/SomatotipoProfile'
import { readStudySession } from '../infrastructure/session/studySessionStore'
import { exportStudyPdf } from '../services/pdf/exportStudyPdf'

export function ResultadoPage() {
  const navigate = useNavigate()
  const reportRef = useRef<HTMLDivElement | null>(null)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
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

  const handleExportPdf = async () => {
    if (!reportRef.current || isExportingPdf) return

    try {
      setIsExportingPdf(true)
      await exportStudyPdf(session, reportRef.current)
    } catch (error) {
      console.error('No se pudo exportar el reporte en PDF', error)
      window.alert('No se pudo generar el PDF. Intentalo nuevamente.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <div ref={reportRef}>
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <button
                data-pdf-ignore="true"
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-lg font-semibold text-slate-700 transition hover:bg-slate-100"
                aria-label="Volver atras"
                title="Volver atras"
              >
                ←
              </button>
              <h1 className="text-3xl font-black text-slate-900">Resultado del estudio</h1>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              {input.nombrePersona} · {input.fechaEvaluacion} · Sexo {input.sexo} · {input.edad} años
            </p>
          </div>
          <button
            data-pdf-ignore="true"
            type="button"
            onClick={() => void handleExportPdf()}
            disabled={isExportingPdf}
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isExportingPdf ? 'Generando PDF...' : 'Exportar PDF'}
          </button>
        </header>

      <section className="space-y-6">
        <div data-pdf-chart="imc" data-pdf-title="Indice de masa corporal">
          <ImcCard resultado={resultado} />
        </div>

        <article data-pdf-ignore="true" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Modulo nutricional independiente
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-900">Calcular calorias y macronutrientes</h2>
              <p className="mt-2 text-sm text-slate-700">
                Usa este informe para precargar sexo, edad, peso, talla y porcentaje de grasa en la vista nutricional.
              </p>
            </div>
            <Link
              to="/nutricion?desde=estudio"
              className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Calcular desde este informe
            </Link>
          </div>
        </article>

        <div className="grid gap-6 lg:grid-cols-2">
          <div data-pdf-chart="composicion" data-pdf-title="Porcentaje de grasa">
            <PorcentajeGrasaBar resultado={resultado} />
          </div>
          <div data-pdf-chart="riesgo-cardiovascular" data-pdf-title="Riesgo cardiovascular">
            <RiesgoCardiovascularCard resultado={resultado} />
          </div>
        </div>

        <div data-pdf-chart="somatotipo" data-pdf-title="Perfil somatotipico">
          <SomatotipoProfile resultado={resultado} />
        </div>

        <div data-pdf-chart="somatocarta" data-pdf-title="Somatocarta">
          <SomatocartaChart resultado={resultado} />
        </div>

      </section>
      </div>
    </main>
  )
}
