import path from 'path'
import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

const logger = createLogger()
const originalWarn = logger.warn
logger.warn = (msg, options) => {
  if (msg.includes('Unknown at rule')) return
  originalWarn(msg, options)
}

// https://vite.dev/config/
export default defineConfig({
  customLogger: logger,
  plugins: [
    TanStackRouterVite({ routesDirectory: './src/routes', generatedRouteTree: './src/routeTree.gen.ts' }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('@tanstack')) {
              return 'vendor-core';
            }
            if (id.includes('react-pdf') || id.includes('pdfjs-dist') || id.includes('docx-preview')) {
              return 'vendor-docs';
            }
            if (id.includes('recharts') || id.includes('d3') || id.includes('@xyflow') || id.includes('dagre')) {
              return 'vendor-charts-flow';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
