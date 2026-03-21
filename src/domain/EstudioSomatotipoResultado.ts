export type EstudioSomatotipoResultado = {
  imc: number
  clasificacionImc: string

  porcentajeGrasa: number
  masaGrasaKg: number
  masaMagraKg: number

  densidadCorporal: number
  aguaCorporalKg: number

  indiceCinturaCadera: number
  indiceCinturaEstatura: number
  riesgoCardiovascular: string

  somatotipo: {
    endomorfia: number
    mesomorfia: number
    ectomorfia: number
  }

  somatocarta: {
    x: number
    y: number
  }

  interpretacionGeneral: string
}
