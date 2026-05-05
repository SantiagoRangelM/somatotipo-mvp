import type { EstudioSomatotipoResultado } from '../../domain/EstudioSomatotipoResultado'

type Props = {
  resultado: EstudioSomatotipoResultado
}

type RiskLevel = 'BAJO' | 'MODERADO' | 'ALTO'

const riskConfig: Record<RiskLevel, { label: string; marker: number; color: string; badge: string }> = {
  BAJO: {
    label: 'Bajo',
    marker: 16,
    color: 'text-emerald-700',
    badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  },
  MODERADO: {
    label: 'Moderado',
    marker: 50,
    color: 'text-amber-700',
    badge: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  ALTO: {
    label: 'Alto',
    marker: 84,
    color: 'text-rose-700',
    badge: 'bg-rose-50 text-rose-800 ring-rose-200',
  },
}

function resolveRiskLevel(riesgoCardiovascular: string): RiskLevel {
  const normalized = riesgoCardiovascular.toLowerCase()

  if (normalized.includes('alto')) return 'ALTO'
  if (normalized.includes('moderado')) return 'MODERADO'
  return 'BAJO'
}

export function RiesgoCardiovascularCard({ resultado }: Props) {
  const riskLevel = resolveRiskLevel(resultado.riesgoCardiovascular)
  const config = riskConfig[riskLevel]

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">Riesgo cardiovascular</h3>
          <p className="mt-1 text-sm text-slate-600">Basado en indice cintura-cadera.</p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-black ${config.color}`}>{config.label}</p>
          <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${config.badge}`}>
            {resultado.riesgoCardiovascular}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="relative h-5 overflow-hidden rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-emerald-400" />
          <div className="absolute inset-y-0 left-1/3 w-1/3 bg-amber-300" />
          <div className="absolute inset-y-0 left-2/3 right-0 bg-rose-400" />
          <div
            className="absolute top-1/2 h-9 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950 shadow"
            style={{ left: `${config.marker}%` }}
            aria-hidden="true"
          />
        </div>

        <div className="mt-3 grid grid-cols-3 text-xs font-semibold text-slate-600">
          <span>Bajo</span>
          <span className="text-center">Moderado</span>
          <span className="text-right">Alto</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Cintura-cadera (ICC)
          </p>
          <p className="mt-1 text-2xl font-black text-slate-900">{resultado.indiceCinturaCadera}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Cintura-estatura (ICE)
          </p>
          <p className="mt-1 text-2xl font-black text-slate-900">{resultado.indiceCinturaEstatura}</p>
        </div>
      </div>
    </article>
  )
}
