export function calculateSomatocarta(variables: {
  endomorfia: number
  mesomorfia: number
  ectomorfia: number
}): { x: number; y: number } {
  const x = variables.ectomorfia - variables.endomorfia
  const y = 2 * variables.mesomorfia - (variables.endomorfia + variables.ectomorfia)

  return { x, y }
}
