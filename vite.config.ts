import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { allowedHosts: ['c441-156-146-62-47.ngrok-free.app'] }
});
