import type { EstudioSomatotipoResultado } from '../../domain/EstudioSomatotipoResultado'

type Props = {
  resultado: EstudioSomatotipoResultado
}

export function ResultadosTable({ resultado }: Props) {
  const rows: Array<[string, string | number]> = [
    ['IMC', resultado.imc],
    ['Clasificacion IMC', resultado.clasificacionImc],
    ['Porcentaje grasa (%)', resultado.porcentajeGrasa],
    ['Masa grasa (kg)', resultado.masaGrasaKg],
    ['Masa magra (kg)', resultado.masaMagraKg],
    ['Densidad corporal', resultado.densidadCorporal],
    ['Agua corporal (kg)', resultado.aguaCorporalKg],
    ['ICC', resultado.indiceCinturaCadera],
    ['ICE', resultado.indiceCinturaEstatura],
    ['Riesgo cardiovascular', resultado.riesgoCardiovascular],
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="odd:bg-slate-50">
              <td className="w-1/2 border-b border-slate-200 px-4 py-3 font-semibold text-slate-800">{label}</td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-700">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
