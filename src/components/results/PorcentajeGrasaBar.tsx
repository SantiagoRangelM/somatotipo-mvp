import type { EstudioSomatotipoResultado } from '../../domain/EstudioSomatotipoResultado'

type Props = {
  resultado: EstudioSomatotipoResultado
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function classifyBodyFat(porcentaje: number): { label: string; color: string } {
  if (porcentaje < 14) return { label: 'Normal', color: 'text-emerald-700' }
  if (porcentaje < 24) return { label: 'Moderado / medio alto', color: 'text-amber-700' }
  return { label: 'Alto', color: 'text-rose-700' }
}

export function PorcentajeGrasaBar({ resultado }: Props) {
  const porcentaje = resultado.porcentajeGrasa
  const pesoComposicionKg = resultado.masaGrasaKg + resultado.masaMagraKg
  const porcentajeMasaMagra = pesoComposicionKg > 0 ? (resultado.masaMagraKg / pesoComposicionKg) * 100 : 0
  const porcentajeMasaMagraLabel = porcentajeMasaMagra.toFixed(1)
  const masaMagraKgLabel = resultado.masaMagraKg.toFixed(1)
  const porcentajeAgua = pesoComposicionKg > 0 ? (resultado.aguaCorporalKg / pesoComposicionKg) * 100 : 0
  const porcentajeAguaLabel = porcentajeAgua.toFixed(1)
  const aguaCorporalKgLabel = resultado.aguaCorporalKg.toFixed(1)
  const markerPosition = clamp((porcentaje / 40) * 100, 0, 100)
  const classification = classifyBodyFat(porcentaje)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">Porcentaje de grasa</h3>
          <p className="mt-1 text-sm text-slate-600">Indicador visual por rangos de referencia del estudio.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-slate-900">{porcentaje}%</p>
          <p className={`text-sm font-bold ${classification.color}`}>{classification.label}</p>
        </div>
      </div>

      <div className="mt-7">
        <div className="relative h-5 overflow-hidden rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-0 w-[35%] bg-emerald-400" />
          <div className="absolute inset-y-0 left-[35%] w-[25%] bg-amber-300" />
          <div className="absolute inset-y-0 left-[60%] right-0 bg-rose-400" />
          <div
            className="absolute top-1/2 h-9 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950 shadow"
            style={{ left: `${markerPosition}%` }}
            aria-hidden="true"
          />
        </div>

        <div className="mt-3 grid grid-cols-3 text-xs font-semibold text-slate-600">
          <span>Normal</span>
          <span className="text-center">Moderado</span>
          <span className="text-right">Alto</span>
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>0%</span>
          <span>14%</span>
          <span>24%</span>
          <span>40%+</span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Masa magra</p>
              <p className="mt-1 text-xs text-slate-500">Estimacion no grasa.</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-cyan-800">{porcentajeMasaMagraLabel}%</p>
              <p className="text-xs font-semibold text-slate-500">{masaMagraKgLabel} kg</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-cyan-500" style={{ width: `${clamp(porcentajeMasaMagra, 0, 100)}%` }} />
          </div>
        </div>

        <div className="rounded-2xl bg-sky-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">Agua corporal</p>
              <p className="mt-1 text-xs text-slate-500">Estimacion total.</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-sky-800">{porcentajeAguaLabel}%</p>
              <p className="text-xs font-semibold text-slate-500">{aguaCorporalKgLabel} kg</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-sky-100">
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${clamp(porcentajeAgua, 0, 100)}%` }} />
          </div>
        </div>
      </div>
    </article>
  )
}
