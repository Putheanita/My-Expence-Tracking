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
          const localDist = path.resolve(base, 'dist')
          const targets = [
            path.resolve(base, '../dist'),
            path.resolve(base, '../public'),
            path.resolve(base, 'public'),
            path.resolve(base, 'frontend/dist'),
            path.resolve(base, '../frontend/dist'),
          ]

          if (fs.existsSync(localDist)) {
            for (const target of targets) {
              try {
                fs.cpSync(localDist, target, { recursive: true, force: true })
              } catch (_) {}
            }
          }
        } catch (err) {
          console.warn('[Build] Warning copying build artifacts:', err)
        }
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: true, // Broadcasts to iPhone over Wi-Fi
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            if ('writeHead' in res && !res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: 'Backend offline, using local storage' }))
            }
          })
        },
      },
    },
  },
})
