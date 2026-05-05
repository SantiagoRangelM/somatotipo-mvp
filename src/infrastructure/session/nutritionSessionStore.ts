import type { NutricionSession } from '../../domain/NutricionSession'

const KEY = 'somatotipo:last-nutrition'

export function saveNutritionSession(session: NutricionSession): void {
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function readNutritionSession(): NutricionSession | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as NutricionSession
  } catch {
    return null
  }
}

export function clearNutritionSession(): void {
  localStorage.removeItem(KEY)
}
