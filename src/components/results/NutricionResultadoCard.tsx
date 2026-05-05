import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import type { CalculoNutricionalResultado } from '../../services/nutrition/types'

type Props = {
  nutricion: CalculoNutricionalResultado
}

const modeLabels = {
  ESTANDAR: 'Modo estandar',
  AVANZADO: 'Modo avanzado',
} as const

const objectiveLabels = {
  MANTENIMIENTO: 'Mantenimiento',
  DEFINICION: 'Definicion',
  VOLUMEN: 'Volumen',
} as const

const intensityLabels = {
  LEVE: 'leve',
  MODERADO: 'moderada',
  ALTO: 'alta',
} as const

const macroColors = {
  Proteina: '#059669',
  Carbohidratos: '#0284c7',
  Grasas: '#f59e0b',
} as const

type MacroName = keyof typeof macroColors
type MacroDatum = {
  name: MacroName
  grams: number
  kcal: number
  chartKcal: number
  percentage: number
}

export function NutricionResultadoCard({ nutricion }: Props) {
  const macroCalories = Math.max(nutricion.proteinaKcal + nutricion.carbohidratosKcal + nutricion.grasaKcal, 1)
  const macroData: MacroDatum[] = [
    {
      name: 'Proteina',
      grams: nutricion.proteinaGramos,
      kcal: nutricion.proteinaKcal,
      chartKcal: Math.max(nutricion.proteinaKcal, 0),
      percentage: Math.round((nutricion.proteinaKcal / macroCalories) * 100),
    },
    {
      name: 'Carbohidratos',
      grams: nutricion.carbohidratosGramos,
      kcal: nutricion.carbohidratosKcal,
      chartKcal: Math.max(nutricion.carbohidratosKcal, 0),
      percentage: Math.round((nutricion.carbohidratosKcal / macroCalories) * 100),
    },
    {
      name: 'Grasas',
      grams: nutricion.grasaGramos,
      kcal: nutricion.grasaKcal,
      chartKcal: Math.max(nutricion.grasaKcal, 0),
      percentage: Math.round((nutricion.grasaKcal / macroCalories) * 100),
    },
  ]
  const rows: Array<[string, string | number]> = [
    ['Proceso nutricional', objectiveLabels[nutricion.objetivo]],
    [
      'Intensidad aplicada',
      nutricion.intensidadObjetivoAplicada ? intensityLabels[nutricion.intensidadObjetivoAplicada] : 'No aplica',
    ],
    ['Calorias mantenimiento', `${nutricion.caloriasMantenimiento} kcal`],
    ['Calorias objetivo', `${nutricion.caloriasObjetivo} kcal`],
    ['Proteina', `${nutricion.proteinaGramos} g (${nutricion.proteinaKcal} kcal)`],
    ['Carbohidratos', `${nutricion.carbohidratosGramos} g (${nutricion.carbohidratosKcal} kcal)`],
    ['Grasas', `${nutricion.grasaGramos} g (${nutricion.grasaKcal} kcal)`],
    ['Calorias recalculadas', `${nutricion.caloriasRecalculadas} kcal`],
  ]

  if (nutricion.masaMagraKg != null) {
    rows.splice(2, 0, ['Masa magra usada', `${nutricion.masaMagraKg} kg`])
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
      <div className="border-b border-emerald-100 bg-emerald-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Prescripcion nutricional
        </p>
        <h2 className="mt-1 text-xl font-black text-slate-900">
          {objectiveLabels[nutricion.objetivo]} · {modeLabels[nutricion.modoUsado]}
        </h2>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={macroData} dataKey="chartKcal" nameKey="name" innerRadius={68} outerRadius={102} paddingAngle={2}>
                  {macroData.map((macro) => (
                    <Cell key={macro.name} fill={macroColors[macro.name]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2">
            {macroData.map((macro) => (
              <div key={macro.name} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: macroColors[macro.name] }} />
                  {macro.name}
                </span>
                <span className="text-sm text-slate-600">
                  {macro.percentage}% · {macro.grams} g
                </span>
              </div>
            ))}
          </div>
        </div>

        <dl className="grid gap-0 overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label} className="border-b border-slate-200 px-5 py-3 even:bg-slate-50 md:odd:border-r">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-2 border-t border-slate-200 px-5 py-4">
        {nutricion.observaciones.map((observacion) => (
          <p key={observacion} className="text-sm text-slate-700">
            {observacion}
          </p>
        ))}
        {nutricion.advertencias.map((advertencia) => (
          <p key={advertencia} className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
            {advertencia}
          </p>
        ))}
      </div>
    </article>
  )
}
