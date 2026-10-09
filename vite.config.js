import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import identity from './scripts/identity-plugin.js'
import fontPreload from './scripts/font-preload-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), identity(), fontPreload()],
  build: {
    sourcemap: false,
  },
})
