import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Site is served from a custom subdomain (nbi.rahulgaibamd.com) at the root,
// so base = '/'. If you ever switch to user-page hosting (username.github.io/repo),
// change base to '/repo-name/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
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
