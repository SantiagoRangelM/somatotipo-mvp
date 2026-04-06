import type { EstudioSomatotipoSession } from '../../domain/EstudioSomatotipoSession'

type JsPdfCtor = typeof import('jspdf').jsPDF
type Html2Canvas = typeof import('html2canvas').default
type JsPdfDocument = InstanceType<JsPdfCtor>

const PDF_SAFE_TAILWIND_COLORS = {
  '--color-amber-50': '#fffbeb',
  '--color-amber-200': '#fde68a',
  '--color-amber-300': '#fcd34d',
  '--color-amber-500': '#f59e0b',
  '--color-amber-700': '#b45309',
  '--color-amber-800': '#92400e',
  '--color-emerald-50': '#ecfdf5',
  '--color-emerald-100': '#d1fae5',
  '--color-emerald-200': '#a7f3d0',
  '--color-emerald-400': '#34d399',
  '--color-emerald-600': '#059669',
  '--color-emerald-700': '#047857',
  '--color-emerald-800': '#065f46',
  '--color-cyan-200': '#a5f3fc',
  '--color-cyan-500': '#06b6d4',
  '--color-cyan-600': '#0891b2',
  '--color-cyan-700': '#0e7490',
  '--color-cyan-800': '#155e75',
  '--color-sky-50': '#f0f9ff',
  '--color-sky-100': '#e0f2fe',
  '--color-sky-300': '#7dd3fc',
  '--color-sky-500': '#0ea5e9',
  '--color-sky-600': '#0284c7',
  '--color-sky-700': '#0369a1',
  '--color-sky-800': '#075985',
  '--color-purple-500': '#a855f7',
  '--color-pink-500': '#ec4899',
  '--color-rose-50': '#fff1f2',
  '--color-rose-200': '#fecdd3',
  '--color-rose-400': '#fb7185',
  '--color-rose-600': '#e11d48',
  '--color-rose-700': '#be123c',
  '--color-rose-800': '#9f1239',
  '--color-slate-50': '#f8fafc',
  '--color-slate-100': '#f1f5f9',
  '--color-slate-200': '#e2e8f0',
  '--color-slate-300': '#cbd5e1',
  '--color-slate-400': '#94a3b8',
  '--color-slate-500': '#64748b',
  '--color-slate-600': '#475569',
  '--color-slate-700': '#334155',
  '--color-slate-800': '#1e293b',
  '--color-slate-900': '#0f172a',
  '--color-slate-950': '#020617',
  '--color-gray-200': '#e5e7eb',
  '--color-white': '#ffffff',
} as const

function buildFileName(session: EstudioSomatotipoSession): string {
  return `reporte-somatotipo-${session.input.nombrePersona.replace(/\s+/g, '-').toLowerCase()}.pdf`
}

function applyPdfSafeStyles(clonedDocument: Document): void {
  clonedDocument.querySelectorAll<HTMLElement>('[data-pdf-ignore="true"]').forEach((element) => {
    element.style.display = 'none'
  })

  Object.entries(PDF_SAFE_TAILWIND_COLORS).forEach(([name, value]) => {
    clonedDocument.documentElement.style.setProperty(name, value)
  })

  clonedDocument.body.style.background = '#f8fafc'

  const style = clonedDocument.createElement('style')
  style.textContent = `
    * {
      transition: none !important;
      animation: none !important;
    }

    .bg-white\\/90 {
      background-color: rgba(255, 255, 255, 0.9) !important;
    }

    .bg-gradient-to-r {
      background-image: linear-gradient(to right, #a855f7, #ec4899) !important;
    }
  `
  clonedDocument.head.appendChild(style)
}

function addLine(doc: JsPdfDocument, state: { y: number }, text: string, spacing = 7): void {
  doc.text(text, 14, state.y)
  state.y += spacing
}

function exportFallbackStudyPdf(session: EstudioSomatotipoSession, JsPdf: JsPdfCtor): void {
  const { input, resultado } = session
  const doc = new JsPdf({ unit: 'mm', format: 'a4' })
  const state = { y: 16 }
  const line = (text: string, spacing = 7) => addLine(doc, state, text, spacing)

  const dominantComponent = [
    { label: 'Endomorfo', value: resultado.somatotipo.endomorfia },
    { label: 'Mesomorfo', value: resultado.somatotipo.mesomorfia },
    { label: 'Ectomorfo', value: resultado.somatotipo.ectomorfia },
  ].sort((a, b) => b.value - a.value)[0].label

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
  line(`Porcentaje de grasa: ${resultado.porcentajeGrasa}%`)
  line(`Masa grasa: ${resultado.masaGrasaKg} kg`)
  line(`Masa magra: ${resultado.masaMagraKg} kg`)
  line(`Densidad corporal: ${resultado.densidadCorporal}`)
  line(`Agua corporal: ${resultado.aguaCorporalKg} kg`)
  line(`Indice cintura-cadera (ICC): ${resultado.indiceCinturaCadera}`)
  line(`Indice cintura-estatura (ICE): ${resultado.indiceCinturaEstatura}`)
  line(`Riesgo cardiovascular: ${resultado.riesgoCardiovascular}`)
  line(`Somatotipo dominante: ${dominantComponent}`, 10)

  doc.setFont('helvetica', 'bold')
  line('Interpretacion', 8)
  doc.setFont('helvetica', 'normal')
  const wrapped = doc.splitTextToSize(resultado.interpretacionGeneral, 180)
  doc.text(wrapped, 14, state.y)

  doc.save(buildFileName(session))
}

export async function exportStudyPdf(session: EstudioSomatotipoSession, reportElement: HTMLElement): Promise<void> {
  const [jsPdfModule, html2CanvasModule] = await Promise.all([import('jspdf'), import('html2canvas')])
  const JsPdf = (jsPdfModule.jsPDF ?? jsPdfModule.default) as JsPdfCtor
  const html2canvas = html2CanvasModule.default as Html2Canvas

  let canvas: HTMLCanvasElement

  try {
    canvas = await html2canvas(reportElement, {
      backgroundColor: '#f8fafc',
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true,
      onclone: applyPdfSafeStyles,
    })
  } catch (error) {
    console.error('No se pudo capturar el reporte visual. Se genera PDF de respaldo.', error)
    exportFallbackStudyPdf(session, JsPdf)
    return
  }

  const pdf = new JsPdf({ orientation: 'p', unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 8
  const imageWidth = pageWidth - margin * 2
  const imageHeight = (canvas.height * imageWidth) / canvas.width
  const imageData = canvas.toDataURL('image/png')

  let remainingHeight = imageHeight
  let y = margin

  pdf.addImage(imageData, 'PNG', margin, y, imageWidth, imageHeight)
  remainingHeight -= pageHeight - margin * 2

  while (remainingHeight > 0) {
    pdf.addPage()
    y = margin - (imageHeight - remainingHeight)
    pdf.addImage(imageData, 'PNG', margin, y, imageWidth, imageHeight)
    remainingHeight -= pageHeight - margin * 2
  }

  pdf.save(buildFileName(session))
}
