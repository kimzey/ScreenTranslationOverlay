import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ['better-sqlite3']
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@main': path.resolve(__dirname, 'src/main'),
        '@shared': path.resolve(__dirname, 'src/shared')
      }
    }
  },
  preload: {
    build: {
      lib: {
        entry: {
          index: path.resolve(__dirname, 'src/renderer/preload/index.ts')
        },
        formats: ['cjs']
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@renderer': path.resolve(__dirname, 'src/renderer'),
        '@shared': path.resolve(__dirname, 'src/shared')
      }
    }
  },
  renderer: {
    root: './ui',
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'ui/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'ui/src'),
        '@shared': path.resolve(__dirname, 'src/shared')
      }
    },
    plugins: [react()],
    server: {
      port: 5173
    }
  }
})
