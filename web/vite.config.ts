import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // three.js (vista 3D) ocupa ~1 MB y se carga solo al abrir el odontograma
    chunkSizeWarningLimit: 1100,
  },
})
