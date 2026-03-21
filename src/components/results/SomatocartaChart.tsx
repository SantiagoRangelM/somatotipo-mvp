import {
  CartesianGrid,
  LabelList,
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
    <div className="h-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">Somatocarta</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 12, right: 16, bottom: 12, left: 6 }}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis type="number" dataKey="x" name="X" domain={[-8, 8]} />
          <YAxis type="number" dataKey="y" name="Y" domain={[-8, 16]} />
          <ReferenceLine x={0} stroke="#334155" strokeDasharray="3 3" />
          <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={data} fill="#ea580c">
            <LabelList dataKey="label" position="top" />
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
