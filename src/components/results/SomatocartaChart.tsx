import {
  CartesianGrid,
  LabelList,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { EstudioSomatotipoResultado } from '../../domain/EstudioSomatotipoResultado'

type Props = {
  resultado: EstudioSomatotipoResultado
}

export function SomatocartaChart({ resultado }: Props) {
  const data = [
    {
      x: resultado.somatocarta.x,
      y: resultado.somatocarta.y,
      label: 'Perfil actual',
    },
  ]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">Somatocarta</h3>
      <p className="mb-3 pr-64 text-xs text-slate-500">X = ectomorfia - endomorfia · Y = 2*mesomorfia - (endomorfia + ectomorfia)</p>

      <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2 text-xs">
        <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-900">Zona endomorfica</span>
        <span className="rounded bg-green-100 px-2 py-1 text-green-900">Zona balanceada</span>
        <span className="rounded bg-cyan-100 px-2 py-1 text-cyan-900">Zona ectomorfica</span>
      </div>

      <div className="h-[320px] w-full overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 26, bottom: 26, left: 18 }}>
          <CartesianGrid strokeDasharray="4 4" />

          <ReferenceArea x1={-8} x2={-1} y1={-8} y2={16} fill="#fde68a" fillOpacity={0.2} />
          <ReferenceArea x1={-1} x2={1} y1={-8} y2={16} fill="#86efac" fillOpacity={0.2} />
          <ReferenceArea x1={1} x2={8} y1={-8} y2={16} fill="#bae6fd" fillOpacity={0.2} />

          <XAxis
            type="number"
            dataKey="x"
            name="X"
            domain={[-8, 8]}
            label={{ value: 'Ectomorfia ←→ Endomorfia', position: 'insideBottom', offset: -8 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Y"
            domain={[-8, 16]}
            label={{ value: 'Mesomorfia', angle: -90, position: 'insideLeft' }}
          />
          <ReferenceLine x={0} stroke="#334155" strokeDasharray="3 3" />
          <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={data} fill="#dc2626">
            <LabelList dataKey="label" position="top" />
          </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
