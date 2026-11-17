import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages project site: https://harshith1118.github.io/safi-root-spa/
  base: '/safi-root-spa/',
  plugins: [react()],
})
