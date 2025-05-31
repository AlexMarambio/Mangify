import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  plugins: [react(), tailwindcss(), flowbiteReact()],
  optimizeDeps: {
    include: ['pdfjs-dist/build/pdf.worker.entry']
  }
})