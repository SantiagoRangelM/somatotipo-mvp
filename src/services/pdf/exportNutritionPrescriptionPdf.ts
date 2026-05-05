import type { NutricionSession } from '../../domain/NutricionSession'

type JsPdfCtor = typeof import('jspdf').jsPDF
type Html2Canvas = typeof import('html2canvas').default
type JsPdfDocument = InstanceType<JsPdfCtor>

const PDF_SAFE_TAILWIND_COLORS = {
  '--color-amber-50': '#fffbeb',
  '--color-amber-200': '#fde68a',
  '--color-amber-800': '#92400e',
  '--color-emerald-50': '#ecfdf5',
  '--color-emerald-100': '#d1fae5',
  '--color-emerald-200': '#a7f3d0',
  '--color-emerald-600': '#059669',
  '--color-emerald-700': '#047857',
  '--color-emerald-800': '#065f46',
  '--color-sky-600': '#0284c7',
  '--color-slate-50': '#f8fafc',
  '--color-slate-100': '#f1f5f9',
  '--color-slate-200': '#e2e8f0',
  '--color-slate-300': '#cbd5e1',
  '--color-slate-500': '#64748b',
  '--color-slate-600': '#475569',
  '--color-slate-700': '#334155',
  '--color-slate-800': '#1e293b',
  '--color-slate-900': '#0f172a',
  '--color-white': '#ffffff',
} as const

function buildFileName(session: NutricionSession): string {
  const date = new Date().toISOString().slice(0, 10)
  return `prescripcion-nutricional-${session.input.objetivo.toLowerCase()}-${date}.pdf`
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

    .bg-white\/90 {
      background-color: rgba(255, 255, 255, 0.9) !important;
    }
  `
  clonedDocument.head.appendChild(style)
}

function addLine(doc: JsPdfDocument, state: { y: number }, text: string, spacing = 7): void {
  doc.text(text, 14, state.y)
  state.y += spacing
}

function exportFallbackNutritionPdf(session: NutricionSession, JsPdf: JsPdfCtor): void {
  const { input, resultado } = session
  const doc = new JsPdf({ unit: 'mm', format: 'a4' })
  const state = { y: 16 }
  const line = (text: string, spacing = 7) => addLine(doc, state, text, spacing)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  line('Prescripcion nutricional', 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  line(`Sexo: ${input.sexo}`)
  line(`Edad: ${input.edad} años`)
  line(`Peso: ${input.pesoKg} kg`)
  line(`Talla: ${input.tallaCm} cm`)
  line(`Nivel de actividad: ${input.nivelActividad}`)
  line(`Objetivo: ${resultado.objetivo}`, 10)

  doc.setFont('helvetica', 'bold')
  line('Resultado', 8)
  doc.setFont('helvetica', 'normal')
  line(`Calorias mantenimiento: ${resultado.caloriasMantenimiento} kcal`)
  line(`Calorias objetivo: ${resultado.caloriasObjetivo} kcal`)
  line(`Proteina: ${resultado.proteinaGramos} g (${resultado.proteinaKcal} kcal)`)
  line(`Carbohidratos: ${resultado.carbohidratosGramos} g (${resultado.carbohidratosKcal} kcal)`)
  line(`Grasas: ${resultado.grasaGramos} g (${resultado.grasaKcal} kcal)`)
  line(`Calorias recalculadas: ${resultado.caloriasRecalculadas} kcal`, 10)

  if (resultado.observaciones.length > 0) {
    doc.setFont('helvetica', 'bold')
    line('Observaciones', 8)
    doc.setFont('helvetica', 'normal')
    resultado.observaciones.forEach((observacion) => {
      const wrapped = doc.splitTextToSize(`- ${observacion}`, 180)
      doc.text(wrapped, 14, state.y)
      state.y += wrapped.length * 6
    })
  }

  doc.save(buildFileName(session))
}

export async function exportNutritionPrescriptionPdf(
  session: NutricionSession,
  prescriptionElement: HTMLElement,
): Promise<void> {
  const [jsPdfModule, html2CanvasModule] = await Promise.all([import('jspdf'), import('html2canvas')])
  const JsPdf = (jsPdfModule.jsPDF ?? jsPdfModule.default) as JsPdfCtor
  const html2canvas = html2CanvasModule.default as Html2Canvas

  let canvas: HTMLCanvasElement

  try {
    canvas = await html2canvas(prescriptionElement, {
      backgroundColor: '#f8fafc',
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true,
      onclone: applyPdfSafeStyles,
    })
  } catch (error) {
    console.error('No se pudo capturar la prescripcion nutricional. Se genera PDF de respaldo.', error)
    exportFallbackNutritionPdf(session, JsPdf)
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
