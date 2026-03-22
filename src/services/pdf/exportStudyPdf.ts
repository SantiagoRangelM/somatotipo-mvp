import type { EstudioSomatotipoSession } from '../../domain/EstudioSomatotipoSession'

function saveCanvasAsPagedPdf(params: {
  canvas: HTMLCanvasElement
  jsPdfCtor: new (options?: { unit?: 'mm'; format?: 'a4' }) => {
    internal: { pageSize: { getWidth: () => number; getHeight: () => number } }
    addImage: (
      imageData: string,
      format: 'PNG' | 'JPEG',
      x: number,
      y: number,
      width: number,
      height: number,
    ) => void
    addPage: () => void
    save: (filename: string) => void
  }
  filename: string
}): void {
  const { canvas, jsPdfCtor, filename } = params

  const pdf = new jsPdfCtor({ unit: 'mm', format: 'a4' })
  const pageWidthMm = pdf.internal.pageSize.getWidth()
  const pageHeightMm = pdf.internal.pageSize.getHeight()
  const marginMm = 8
  const usableWidthMm = pageWidthMm - marginMm * 2
  const usableHeightMm = pageHeightMm - marginMm * 2

  const pageHeightPx = Math.floor((usableHeightMm * canvas.width) / usableWidthMm)
  const totalPages = Math.ceil(canvas.height / pageHeightPx)

  for (let page = 0; page < totalPages; page += 1) {
    if (page > 0) {
      pdf.addPage()
    }

    const sourceY = page * pageHeightPx
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - sourceY)

    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = canvas.width
    pageCanvas.height = sliceHeightPx

    const ctx = pageCanvas.getContext('2d')
    if (!ctx) continue

    ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx)

    const imageData = pageCanvas.toDataURL('image/png')
    const renderedHeightMm = (sliceHeightPx * usableWidthMm) / canvas.width
    pdf.addImage(imageData, 'PNG', marginMm, marginMm, usableWidthMm, renderedHeightMm)
  }

  pdf.save(filename)
}

export async function exportStudyPdf(
  session: EstudioSomatotipoSession,
  resultsElement?: HTMLElement | null,
): Promise<void> {
  const { input, resultado } = session

  const [{ default: html2canvas }, jsPdfModule] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])
  const JsPdfCtor = (jsPdfModule.jsPDF ?? jsPdfModule.default) as typeof jsPdfModule.jsPDF

  if (resultsElement) {
    try {
      const canvas = await html2canvas(resultsElement, {
        scale: 1.8,
        useCORS: true,
        backgroundColor: '#f4f6fb',
        windowWidth: resultsElement.scrollWidth,
        windowHeight: resultsElement.scrollHeight,
        scrollX: 0,
        scrollY: -window.scrollY,
      })

      saveCanvasAsPagedPdf({
        canvas,
        jsPdfCtor: JsPdfCtor,
        filename: `reporte-somatotipo-${input.nombrePersona.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      })
      return
    } catch (error) {
      console.error('PDF visual export failed, using text fallback:', error)
    }
  }

  const doc = new JsPdfCtor({ unit: 'mm', format: 'a4' })
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
