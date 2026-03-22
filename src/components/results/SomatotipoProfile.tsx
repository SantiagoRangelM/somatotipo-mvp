import type { EstudioSomatotipoResultado } from '../../domain/EstudioSomatotipoResultado'

type Props = {
  resultado: EstudioSomatotipoResultado
}

function getDominant(resultado: EstudioSomatotipoResultado): 'Endomorfo' | 'Mesomorfo' | 'Ectomorfo' {
  const candidates = [
    { label: 'Endomorfo' as const, value: resultado.somatotipo.endomorfia },
    { label: 'Mesomorfo' as const, value: resultado.somatotipo.mesomorfia },
    { label: 'Ectomorfo' as const, value: resultado.somatotipo.ectomorfia },
  ]

  return candidates.sort((a, b) => b.value - a.value)[0].label
}

function barWidth(value: number): string {
  const normalized = Math.max(0, Math.min(100, (value / 10) * 100))
  return `${normalized}%`
}

export function SomatotipoProfile({ resultado }: Props) {
  const dominant = getDominant(resultado)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">Perfil somatotipico</h2>
      <p className="mt-2 text-sm text-slate-700">
        Somatotipo: <strong>{resultado.somatotipo.endomorfia} - {resultado.somatotipo.mesomorfia} - {resultado.somatotipo.ectomorfia}</strong>
      </p>
      <p className="text-sm text-slate-700">
        Componente dominante: <strong>{dominant}</strong>
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-600"><span>Endomorfia</span><span>{resultado.somatotipo.endomorfia}</span></div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-amber-500" style={{ width: barWidth(resultado.somatotipo.endomorfia) }} /></div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-600"><span>Mesomorfia</span><span>{resultado.somatotipo.mesomorfia}</span></div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-emerald-600" style={{ width: barWidth(resultado.somatotipo.mesomorfia) }} /></div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs text-slate-600"><span>Ectomorfia</span><span>{resultado.somatotipo.ectomorfia}</span></div>
          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-sky-600" style={{ width: barWidth(resultado.somatotipo.ectomorfia) }} /></div>
        </div>
      </div>
    </article>
  )
}
