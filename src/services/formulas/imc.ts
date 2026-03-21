export function calculateImc(pesoKg: number, tallaCm: number): number {
  const tallaM = tallaCm / 100
  return pesoKg / (tallaM * tallaM)
}

export function classifyImc(imc: number): string {
  if (imc < 18.5) return 'Bajo peso'
  if (imc < 25) return 'Normopeso'
  if (imc < 30) return 'Sobrepeso'
  if (imc < 35) return 'Obesidad grado I'
  if (imc < 40) return 'Obesidad grado II'
  return 'Obesidad grado III'
}
