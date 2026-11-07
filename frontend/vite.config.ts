import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-build-outputs',
      closeBundle() {
        try {
          const base = import.meta.dirname || process.cwd()
          const rootPublic = path.resolve(base, '../public')
          const rootDist = path.resolve(base, '../dist')
          const localDist = path.resolve(base, 'dist')
          if (fs.existsSync(rootPublic)) {
            fs.cpSync(rootPublic, rootDist, { recursive: true, force: true })
            fs.cpSync(rootPublic, localDist, { recursive: true, force: true })
          }
        } catch (err) {
          console.warn('[Build] Warning copying build artifacts:', err)
        }
      },
    },
  ],
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  server: {
    host: true, // Broadcasts to iPhone over Wi-Fi
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
