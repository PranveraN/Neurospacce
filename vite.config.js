import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{js,ts,jsx,tsx}'],
  },
  server: {
    host: true,
  },
  build: {
    // Raise warning threshold — vendor chunks legitimately exceed 500 kB
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Vite 8 (Rolldown) requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router-dom/') ||
              id.includes('node_modules/react-router/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/framer-motion/')) return 'vendor-motion'
          if (id.includes('node_modules/recharts/'))      return 'vendor-recharts'
          if (id.includes('node_modules/@supabase/'))     return 'vendor-supabase'
          if (id.includes('node_modules/lucide-react/'))  return 'vendor-icons'
        },
      },
    },
  },
})
