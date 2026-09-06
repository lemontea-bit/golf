import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from https://lemontea-bit.github.io/golf/ via GitHub Pages.
  base: '/golf/',
})
