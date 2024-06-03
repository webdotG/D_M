import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/D_M",
  optimizeDeps: {
    include: ['*.mp4'],
  },
})
