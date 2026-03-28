import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2015', // Increase compatibility for older browsers like Firefox
    cssTarget: 'chrome61', // Better CSS compatibility
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'firebase/app', 'firebase/firestore'],
        },
      },
    },
  },
})
