import type { EstudioSomatotipoSession } from '../../domain/EstudioSomatotipoSession'

const KEY = 'somatotipo:last-study'

export function saveStudySession(session: EstudioSomatotipoSession): void {
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function readStudySession(): EstudioSomatotipoSession | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as EstudioSomatotipoSession
  } catch {
    return null
  }
}

export function clearStudySession(): void {
  localStorage.removeItem(KEY)
}
