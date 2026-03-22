import type { EstudioSomatotipoSession } from '../../domain/EstudioSomatotipoSession'

type JsPdfCtor = typeof import('jspdf').jsPDF

export async function exportStudyPdf(session: EstudioSomatotipoSession): Promise<void> {
  const { input, resultado } = session
  const jsPdfModule = await import('jspdf')

  const JsPdf = (jsPdfModule.jsPDF ?? jsPdfModule.default) as JsPdfCtor
  const doc = new JsPdf({ unit: 'mm', format: 'a4' })

  const dominantComponent = [
    { label: 'Endomorfo', value: resultado.somatotipo.endomorfia },
    { label: 'Mesomorfo', value: resultado.somatotipo.mesomorfia },
    { label: 'Ectomorfo', value: resultado.somatotipo.ectomorfia },
  ].sort((a, b) => b.value - a.value)[0].label

  let y = 16
  const line = (text: string, spacing = 7) => {
    doc.text(text, 14, y)
    y += spacing
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  line('Reporte de Estudio Somatotipo', 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  line(`Nombre: ${input.nombrePersona}`)
  line(`Fecha: ${input.fechaEvaluacion}`)
  line(`Sexo: ${input.sexo}`)
  line(`Edad: ${input.edad} años`, 10)

  doc.setFont('helvetica', 'bold')
  line('Resultados', 8)
  doc.setFont('helvetica', 'normal')
  line(`IMC: ${resultado.imc} (${resultado.clasificacionImc})`)
  line(`% Grasa: ${resultado.porcentajeGrasa}%`)
  line(`Masa grasa: ${resultado.masaGrasaKg} kg`)
  line(`Masa magra: ${resultado.masaMagraKg} kg`)
  line(`Densidad corporal: ${resultado.densidadCorporal}`)
  line(`Agua corporal: ${resultado.aguaCorporalKg} kg`)
  line(`ICC: ${resultado.indiceCinturaCadera}`)
  line(`ICE: ${resultado.indiceCinturaEstatura}`)
  line(`Riesgo cardiovascular: ${resultado.riesgoCardiovascular}`)
  line(`Somatotipo (componente dominante): ${dominantComponent}`, 10)

  doc.setFont('helvetica', 'bold')
  line('Interpretacion', 8)
  doc.setFont('helvetica', 'normal')
  const wrapped = doc.splitTextToSize(resultado.interpretacionGeneral, 180)
  doc.text(wrapped, 14, y)

  doc.save(`reporte-somatotipo-${input.nombrePersona.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
