import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/somatotipo-mvp/' : '/',
  plugins: [react(), tailwindcss()],
}))
