import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,   // <-- 해시 파일 자동 주입에 사용
    outDir: 'dist',
  },
})