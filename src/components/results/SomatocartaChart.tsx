import { useEffect, useRef } from 'react'

import type { EstudioSomatotipoResultado } from '../../domain/EstudioSomatotipoResultado'

type Props = {
  resultado: EstudioSomatotipoResultado
}

type ChartDomain = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  step: number
}

type PlotPoint = {
  x: number
  y: number
}

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 620
const PADDING = {
  top: 72,
  right: 72,
  bottom: 78,
  left: 72,
}

function roundUpToStep(value: number, step: number): number {
  return Math.ceil(value / step) * step
}

function resolveGridStep(maxMagnitude: number): number {
  if (maxMagnitude > 250) return 100
  if (maxMagnitude > 120) return 50
  if (maxMagnitude > 60) return 20
  if (maxMagnitude > 25) return 10
  return 5
}

function resolveDomain(x: number, y: number): ChartDomain {
  const maxMagnitude = Math.max(Math.abs(x), Math.abs(y), 16)
  const step = resolveGridStep(maxMagnitude)
  const xLimit = roundUpToStep(Math.max(8, Math.abs(x) + step), step)
  const yCenter = 3
  const yHalfRange = roundUpToStep(Math.max(13, Math.abs(y - yCenter) + step), step)

  return {
    xMin: -xLimit,
    xMax: xLimit,
    yMin: yCenter - yHalfRange,
    yMax: yCenter + yHalfRange,
    step,
  }
}

function range(min: number, max: number, step: number): number[] {
  const values: number[] = []

  for (let value = min; value <= max; value += step) {
    values.push(value)
  }

  return values
}

function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : `${value}`
}

function createProjector(domain: ChartDomain) {
  const plotWidth = CANVAS_WIDTH - PADDING.left - PADDING.right
  const plotHeight = CANVAS_HEIGHT - PADDING.top - PADDING.bottom

  return (point: PlotPoint): PlotPoint => ({
    x: PADDING.left + ((point.x - domain.xMin) / (domain.xMax - domain.xMin)) * plotWidth,
    y: PADDING.top + ((domain.yMax - point.y) / (domain.yMax - domain.yMin)) * plotHeight,
  })
}

function drawGrid(ctx: CanvasRenderingContext2D, domain: ChartDomain, project: (point: PlotPoint) => PlotPoint): void {
  ctx.save()
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.26)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 8])
  ctx.font = '12px Segoe UI, system-ui, sans-serif'
  ctx.fillStyle = '#334155'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  for (const x of range(domain.xMin, domain.xMax, domain.step)) {
    const start = project({ x, y: domain.yMin })
    const end = project({ x, y: domain.yMax })
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    ctx.fillText(formatSigned(x), start.x, start.y + 10)
  }

  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (const y of range(domain.yMin, domain.yMax, domain.step)) {
    const start = project({ x: domain.xMin, y })
    const end = project({ x: domain.xMax, y })
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
    ctx.fillText(formatSigned(y), end.x - 8, end.y)
  }

  ctx.restore()
}

function drawAxes(ctx: CanvasRenderingContext2D, domain: ChartDomain, project: (point: PlotPoint) => PlotPoint): void {
  const yAxisStart = project({ x: 0, y: domain.yMin })
  const yAxisEnd = project({ x: 0, y: domain.yMax })
  const xAxisStart = project({ x: domain.xMin, y: 0 })
  const xAxisEnd = project({ x: domain.xMax, y: 0 })

  ctx.save()
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2
  ctx.setLineDash([])
  ctx.beginPath()
  ctx.moveTo(yAxisStart.x, yAxisStart.y)
  ctx.lineTo(yAxisEnd.x, yAxisEnd.y)
  ctx.moveTo(xAxisStart.x, xAxisStart.y)
  ctx.lineTo(xAxisEnd.x, xAxisEnd.y)
  ctx.stroke()
  ctx.restore()
}

function drawSomatoZones(ctx: CanvasRenderingContext2D, domain: ChartDomain, project: (point: PlotPoint) => PlotPoint): void {
  const xLimit = Math.max(8, Math.min(Math.abs(domain.xMin), Math.abs(domain.xMax)))
  const yBottom = Math.min(-10, domain.yMin)
  const yTop = Math.max(12, domain.yMax)
  const yLowerShoulder = yBottom + (yTop - yBottom) * 0.18
  const ySideControl = yBottom + (yTop - yBottom) * 0.62
  const yBottomCurve = yBottom + (yTop - yBottom) * 0.04

  const center = project({ x: 0, y: 0 })
  const top = project({ x: 0, y: yTop })
  const rightControlA = project({ x: xLimit * 0.45, y: yTop })
  const rightControlB = project({ x: xLimit, y: ySideControl })
  const rightBase = project({ x: xLimit, y: yLowerShoulder })
  const leftControlA = project({ x: -xLimit * 0.45, y: yTop })
  const leftControlB = project({ x: -xLimit, y: ySideControl })
  const leftBase = project({ x: -xLimit, y: yLowerShoulder })
  const bottomLeft = project({ x: -xLimit, y: yLowerShoulder })
  const bottomControlA = project({ x: -xLimit, y: yBottomCurve })
  const bottomControlB = project({ x: -xLimit * 0.5, y: yBottom })
  const bottomCenter = project({ x: 0, y: yBottom })
  const bottomControlC = project({ x: xLimit * 0.5, y: yBottom })
  const bottomControlD = project({ x: xLimit, y: yBottomCurve })
  const bottomRight = project({ x: xLimit, y: yLowerShoulder })

  ctx.save()
  ctx.lineWidth = 2
  ctx.setLineDash([])

  ctx.beginPath()
  ctx.moveTo(center.x, center.y)
  ctx.lineTo(top.x, top.y)
  ctx.bezierCurveTo(rightControlA.x, rightControlA.y, rightControlB.x, rightControlB.y, rightBase.x, rightBase.y)
  ctx.closePath()
  ctx.fillStyle = 'rgba(134, 239, 172, 0.46)'
  ctx.strokeStyle = 'rgba(22, 101, 52, 0.62)'
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(center.x, center.y)
  ctx.lineTo(top.x, top.y)
  ctx.bezierCurveTo(leftControlA.x, leftControlA.y, leftControlB.x, leftControlB.y, leftBase.x, leftBase.y)
  ctx.closePath()
  ctx.fillStyle = 'rgba(253, 186, 116, 0.46)'
  ctx.strokeStyle = 'rgba(146, 64, 14, 0.62)'
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(bottomLeft.x, bottomLeft.y)
  ctx.bezierCurveTo(bottomControlA.x, bottomControlA.y, bottomControlB.x, bottomControlB.y, bottomCenter.x, bottomCenter.y)
  ctx.bezierCurveTo(bottomControlC.x, bottomControlC.y, bottomControlD.x, bottomControlD.y, bottomRight.x, bottomRight.y)
  ctx.lineTo(center.x, center.y)
  ctx.closePath()
  ctx.fillStyle = 'rgba(254, 240, 138, 0.52)'
  ctx.strokeStyle = 'rgba(161, 98, 7, 0.58)'
  ctx.fill()
  ctx.stroke()

  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(center.x, center.y)
  ctx.lineTo(rightBase.x, rightBase.y)
  ctx.moveTo(center.x, center.y)
  ctx.lineTo(leftBase.x, leftBase.y)
  ctx.moveTo(center.x, center.y)
  ctx.lineTo(top.x, top.y)
  ctx.stroke()

  ctx.fillStyle = '#0f172a'
  ctx.font = 'bold 16px Segoe UI, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Mesomorfo', top.x, top.y - 18)
  ctx.fillText('Endomorfo', leftBase.x + 46, leftBase.y + 34)
  ctx.fillText('Ectomorfo', rightBase.x - 46, rightBase.y + 34)
  ctx.restore()
}

function drawPoint(ctx: CanvasRenderingContext2D, point: PlotPoint, project: (point: PlotPoint) => PlotPoint): void {
  const projected = project(point)

  ctx.save()
  ctx.beginPath()
  ctx.arc(projected.x, projected.y, 13, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(239, 68, 68, 0.18)'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(projected.x, projected.y, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#ef4444'
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 3
  ctx.fill()
  ctx.stroke()
  ctx.font = 'bold 14px Segoe UI, system-ui, sans-serif'
  ctx.fillStyle = '#7f1d1d'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'bottom'
  ctx.fillText('Perfil actual', Math.min(projected.x + 12, CANVAS_WIDTH - 120), Math.max(projected.y - 10, 24))
  ctx.restore()
}

function drawChart(canvas: HTMLCanvasElement, resultado: EstudioSomatotipoResultado): void {
  const context = canvas.getContext('2d')
  if (!context) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = CANVAS_WIDTH * dpr
  canvas.height = CANVAS_HEIGHT * dpr
  context.setTransform(dpr, 0, 0, dpr, 0, 0)

  const domain = resolveDomain(resultado.somatocarta.x, resultado.somatocarta.y)
  const project = createProjector(domain)

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawGrid(context, domain, project)
  drawSomatoZones(context, domain, project)
  drawAxes(context, domain, project)
  drawPoint(context, resultado.somatocarta, project)
}

export function SomatocartaChart({ resultado }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const domain = resolveDomain(resultado.somatocarta.x, resultado.somatocarta.y)

  useEffect(() => {
    if (!canvasRef.current) return
    drawChart(canvasRef.current, resultado)
  }, [resultado])

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-600">Somatocarta Heath-Carter</h3>
          <p className="mt-1 text-xs text-slate-500">
            X = ectomorfia - endomorfia · Y = 2*mesomorfia - (endomorfia + ectomorfia)
          </p>
        </div>
        <div className="grid gap-1 text-right text-xs text-slate-600">
          <span>
            Punto X/Y: {formatSigned(resultado.somatocarta.x)} / {formatSigned(resultado.somatocarta.y)}
          </span>
          <span>Escala: {domain.step} en {domain.step}</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="mx-auto block h-auto w-full max-w-4xl rounded border border-slate-300"
      />
    </article>
  )
}
