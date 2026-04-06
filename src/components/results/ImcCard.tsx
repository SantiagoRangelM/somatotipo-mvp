import type { EstudioSomatotipoResultado } from '../../domain/EstudioSomatotipoResultado'

type Props = {
  resultado: EstudioSomatotipoResultado
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function markerPosition(imc: number): number {
  return clamp((imc / 40) * 100, 0, 100)
}

export function ImcCard({ resultado }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">Indice de masa corporal</h2>
          <p className="mt-1 text-sm text-slate-600">Clasificacion visual del IMC.</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-slate-900">{resultado.imc}</p>
          <p className="text-sm font-bold text-cyan-700">{resultado.clasificacionImc}</p>
        </div>
      </div>

      <div className="mt-7">
        <div className="relative h-5 overflow-hidden rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-0 w-[46.25%] bg-sky-300" />
          <div className="absolute inset-y-0 left-[46.25%] w-[16.25%] bg-emerald-400" />
          <div className="absolute inset-y-0 left-[62.5%] w-[12.5%] bg-amber-300" />
          <div className="absolute inset-y-0 left-[75%] right-0 bg-rose-400" />
          <div
            className="absolute top-1/2 h-9 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-950 shadow"
            style={{ left: `${markerPosition(resultado.imc)}%` }}
            aria-hidden="true"
          />
        </div>

        <div className="mt-3 grid grid-cols-4 text-xs font-semibold text-slate-600">
          <span>Bajo</span>
          <span className="text-center">Normal</span>
          <span className="text-center">Sobrepeso</span>
          <span className="text-right">Obesidad</span>
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-slate-500">
          <span>0</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40+</span>
        </div>
      </div>
    </article>
  )
}
