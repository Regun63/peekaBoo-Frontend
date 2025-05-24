import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  base: '/peekaBoo/', // 👈 this tells Vite your app starts here
  server: {
    port: 5174,
  },

})
