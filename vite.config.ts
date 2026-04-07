import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 加入這一行，確保在 GitHub Pages 上的路徑正確
  plugins: [react()],
  optimizeDeps: {
    include: ['react-vertical-timeline-component']
  }
})
