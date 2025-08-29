import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Flask가 실제로 서빙하는 정적 경로에 맞춰줌
  base: '/static/react/dist/',
  build: {
    outDir: 'dist',
    manifest: true,
    emptyOutDir: true,
  },
})