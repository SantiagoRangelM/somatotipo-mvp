import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import type { EstudioSomatotipoResultado } from '../../domain/EstudioSomatotipoResultado'

type Props = {
  resultado: EstudioSomatotipoResultado
}

export function ComposicionChart({ resultado }: Props) {
  const data = [
    { metric: 'Masa Grasa', value: resultado.masaGrasaKg },
    { metric: 'Masa Magra', value: resultado.masaMagraKg },
    { metric: 'Agua Corporal', value: resultado.aguaCorporalKg },
  ]

  return (
    <div className="h-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">Composicion corporal</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#0e7490" radius={6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
