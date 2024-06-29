import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: "/D_M",
  optimizeDeps: {
    include: ['*.mp4'],
  },  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:2525',
        changeOrigin: true,
      }
    }
  }

})
