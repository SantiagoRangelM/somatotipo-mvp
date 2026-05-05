import { Navigate, Route, Routes } from 'react-router-dom'

import { HomePage } from './pages/HomePage'
import { NuevoEstudioPage } from './pages/NuevoEstudioPage'
import { NutricionPage } from './pages/NutricionPage'
import { ResultadoPage } from './pages/ResultadoPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/nuevo" element={<NuevoEstudioPage />} />
      <Route path="/nutricion" element={<NutricionPage />} />
      <Route path="/resultado" element={<ResultadoPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
