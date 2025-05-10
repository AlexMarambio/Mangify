import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.entry']
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),      // tu app principal
        viewer: resolve(__dirname, 'viewer.html')     // entrada del iframe
      }
    }
  }
})
