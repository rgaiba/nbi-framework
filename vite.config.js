import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use a relative base ('./') so the built bundle works at BOTH the github.io
// subpath URL (https://username.github.io/nbi-framework/) AND a custom-domain
// root URL (https://nbi.rahulgaibamd.com). Asset URLs resolve relative to the
// document, so we don't have to reconfigure once DNS is in place.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
  server: {
    port: 5173,
    open: false,
  },
})
