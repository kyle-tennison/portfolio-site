import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  // base: '/portfolio-site/', // remove after changing to custon domain
  plugins: [react()],
})
