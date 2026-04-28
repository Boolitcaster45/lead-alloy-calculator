import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages base path — matches repo name at:
// https://github.com/Boolitcaster45/lead-alloy-calculator
export default defineConfig({
  plugins: [react()],
  base: '/lead-alloy-calculator/',
})
