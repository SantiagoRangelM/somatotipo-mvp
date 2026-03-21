import jsPDF from 'jspdf'

import type { EstudioSomatotipoSession } from '../../domain/EstudioSomatotipoSession'

export function exportStudyPdf(session: EstudioSomatotipoSession): void {
  const { input, resultado } = session

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
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
  line(`Edad: ${input.edad} anos`, 10)

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
  line(
    `Somatotipo: ${resultado.somatotipo.endomorfia}-${resultado.somatotipo.mesomorfia}-${resultado.somatotipo.ectomorfia}`,
  )
  line(`Somatocarta (X,Y): ${resultado.somatocarta.x}, ${resultado.somatocarta.y}`, 10)

  doc.setFont('helvetica', 'bold')
  line('Interpretacion', 8)
  doc.setFont('helvetica', 'normal')
  const wrapped = doc.splitTextToSize(resultado.interpretacionGeneral, 180)
  doc.text(wrapped, 14, y)

  doc.save(`reporte-somatotipo-${input.nombrePersona.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
