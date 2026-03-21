# AGENT.md — Proyecto Somatotipo MVP (Ruta A)

## 1. Contexto del proyecto

Aplicación web (frontend-only) para calcular un estudio antropométrico completo basado en:

* Jackson & Pollock (7 pliegues)
* Siri (% grasa)
* Watson (agua corporal)
* Heath-Carter (somatotipo)
* Indicadores cardiometabólicos (IMC, ICC, ICE)

El sistema:

* recibe medidas completas de una persona,
* valida todos los campos,
* ejecuta un pipeline de cálculo determinista,
* muestra resultados en tabla y gráficos,
* permite exportar PDF.

No hay backend en esta fase.
Persistencia: navegador (localStorage, no histórico real).

---

## 2. Stack tecnológico (obligatorio)

### Frontend

* React 18+
* TypeScript
* Vite
* Tailwind CSS
* React Hook Form
* Zod (validación)
* Recharts (gráficas)
* pdf-lib o jsPDF (PDF)

### Infraestructura

* GitHub Pages (deploy estático)
* GitHub Actions (CI/CD)

### Persistencia

* localStorage (fase actual)
* Preparado para migrar a Supabase (NO implementar aún)

---

## 3. Principios arquitectónicos

1. **Frontend-only (sin backend)**
2. **Separación estricta de capas**
3. **Lógica de negocio fuera de UI**
4. **Cálculo determinista**
5. **Validación estricta (todos los campos obligatorios)**
6. **Preparado para migración a Supabase**

---

## 4. Estructura del proyecto

```text
src/
├── pages/
├── components/
├── domain/
├── application/
├── services/
├── infrastructure/
├── shared/
```

### Regla clave:

* `components/` → UI
* `services/` → fórmulas
* `application/` → orquestación
* `domain/` → tipos
* `infrastructure/` → almacenamiento / PDF

---

## 5. Modelo de datos

### Input principal

```ts
type EstudioSomatotipoInput = {
  nombrePersona: string;
  fechaEvaluacion: string;
  sexo: "M" | "F";
  edad: number;

  pesoKg: number;
  tallaCm: number;

  perimetros: {
    cinturaCm: number;
    caderaCm: number;
    brazoFlexionadoCm: number;
    pantorrillaMaximaCm: number;
  };

  diametrosOseos: {
    humeroBiepicondilarCm: number;
    femurBicondilarCm: number;
  };

  plieguesJP7: {
    pectoralMm: number;
    axilarMediaMm: number;
    tricepsMm: number;
    subescapularMm: number;
    abdominalMm: number;
    suprailiacoMm: number;
    musloAnteriorMm: number;
  };

  plieguesHeathCarter: {
    supraspinaleMm: number;
    pantorrillaMedialMm: number;
  };
};
```

---

### Resultado

```ts
type EstudioSomatotipoResultado = {
  imc: number;
  clasificacionImc: string;

  porcentajeGrasa: number;
  masaGrasaKg: number;
  masaMagraKg: number;

  densidadCorporal: number;
  aguaCorporalKg: number;

  indiceCinturaCadera: number;
  riesgoCardiovascular: string;

  somatotipo: {
    endomorfia: number;
    mesomorfia: number;
    ectomorfia: number;
  };

  somatocarta: {
    x: number;
    y: number;
  };

  interpretacionGeneral: string;
};
```

---

## 6. Validaciones (OBLIGATORIO)

### Reglas:

* TODOS los campos son obligatorios
* No valores negativos ni cero
* Tipos numéricos estrictos
* Validación por campo (no global)

### Unidades:

* peso → kg
* talla → cm
* perímetros → cm
* diámetros → cm (convertir si vienen en mm)
* pliegues → mm

---

## 7. Pipeline de cálculo (CRÍTICO)

Orden obligatorio:

1. Validación
2. Normalización de unidades
3. IMC
4. ICC (cintura/cadera)
5. ICE (cintura/altura)
6. Suma 7 pliegues
7. Densidad corporal (JP7)
8. % grasa (Siri)
9. Masa grasa
10. Masa magra
11. Agua corporal (Watson)
12. Endomorfia
13. Perímetros corregidos
14. Mesomorfia
15. Ectomorfia
16. Somatocarta (X/Y)
17. Interpretación

---

## 8. Servicios (lógica de negocio)

Ubicación: `services/formulas/`

Archivos obligatorios:

* imc.ts
* risk.ts (ICC, ICE)
* jp7.ts
* siri.ts
* watson.ts
* heathCarter.ts
* somatocarta.ts
* interpretation.ts

### Regla:

NINGUNA fórmula puede estar en componentes.

---

## 9. Application layer

Archivo principal:

```ts
calculateStudy.ts
```

Responsabilidades:

* recibe input
* valida
* normaliza
* ejecuta fórmulas
* construye resultado

---

## 10. UI (Frontend)

### Páginas

* HomePage
* NuevoEstudioPage
* ResultadoPage

### Formulario dividido en:

1. Datos básicos
2. Perímetros
3. Diámetros
4. JP7
5. Heath-Carter

### Regla UX:

Botón **Calcular** solo activo si todo es válido.

---

## 11. Persistencia

### Actual:

* localStorage
* guardar último estudio (opcional)

### Estructura:

```ts
interface StudyRepository {
  save(snapshot)
  get()
}
```

### Futuro:

* Supabase (NO implementar ahora)

---

## 12. PDF

Debe incluir:

* datos de la persona
* tabla completa de resultados
* somatotipo
* interpretación

Ubicación:

```text
infrastructure/pdf/
```

---

## 13. Testing (OBLIGATORIO)

Carpeta:

```text
tests/formulas/
```

Testear:

* IMC
* JP7
* Siri
* Watson
* Heath-Carter
* Somatocarta

---

## 14. Restricciones importantes

NO implementar:

* historial
* múltiples evaluaciones
* autenticación
* backend
* base de datos
* densidad ósea real (no válida por antropometría)

---

## 15. Flujo del sistema

1. Usuario llena formulario
2. Validación estricta
3. Cálculo completo
4. Mostrar resultados
5. Exportar PDF

---

## 16. Objetivo del agente

El agente debe:

1. Crear estructura del proyecto
2. Implementar formulario completo
3. Implementar validaciones
4. Implementar motor de cálculo
5. Renderizar resultados
6. Generar PDF
7. Preparar para deploy en GitHub Pages

---

## 17. Prioridad de implementación

Orden:

1. domain/
2. validation/
3. formulas/
4. calculateStudy.ts
5. formulario
6. resultados
7. PDF
8. deploy

---

## 18. Definición de éxito

El sistema está completo cuando:

* Todos los datos son obligatorios
* Calcula correctamente todos los indicadores
* Muestra resultados claros
* Genera PDF
* Funciona sin backend
* Se despliega en GitHub Pages

---

## 19. Nota final

Este sistema NO es clínico, es educativo/deportivo.
Las fórmulas deben implementarse correctamente y mantenerse desacopladas.

---
