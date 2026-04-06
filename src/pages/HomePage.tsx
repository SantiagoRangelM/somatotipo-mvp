import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20 md:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">Somatotipo MVP</p>
        <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
          Evaluacion antropometrica con pipeline cientifico completo.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-slate-600">
          Captura medidas, calcula composicion corporal, visualiza somatocarta y usa el modulo separado de calorias y
          macronutrientes.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/nuevo"
            className="rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            Nuevo estudio
          </Link>
          <Link
            to="/nutricion"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Calcular calorias y macros
          </Link>
          <Link
            to="/resultado"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Ver ultimo resultado
          </Link>
        </div>
      </section>
    </main>
  )
}
