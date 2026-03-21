# somatotipo-mvp

Aplicacion frontend (React + TypeScript + Vite) para evaluacion antropometrica y calculo de somatotipo.

## Caracteristicas

- Formulario completo con validacion obligatoria (React Hook Form + Zod)
- Pipeline matematico desacoplado en `application/use-cases/calculateStudy.ts`
- Formulas puras en `services/formulas/`
- Visualizacion de resultados en tabla y graficas (Recharts)
- Somatocarta en grafico de dispersion
- Exportacion de reporte PDF (jsPDF)
- Persistencia local de la ultima sesion (localStorage)
- Tests unitarios de formulas con Vitest

## Stack

- React 19 (compatible 18+)
- TypeScript estricto
- Vite
- Tailwind CSS
- React Hook Form
- Zod
- Recharts
- jsPDF
- Vitest

## Ejecutar en local

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Deploy en GitHub Pages

1. Sube el repo a GitHub con rama `main`.
2. En GitHub, ve a `Settings > Pages`.
3. En `Build and deployment`, selecciona `GitHub Actions`.
4. El workflow `.github/workflows/deploy-pages.yml` hace:
   - `npm ci`
   - `npm run test`
   - `npm run build`
   - publica `dist` en Pages.
5. URL esperada del proyecto:
   - `https://<usuario>.github.io/somatotipo-mvp/`

> `vite.config.ts` ya incluye `base: '/somatotipo-mvp/'` para produccion.
