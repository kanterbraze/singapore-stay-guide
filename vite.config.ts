import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/', // Changed from '/singapore-stay-guide/' for Vercel deployment
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(env.GOOGLE_MAPS_API_KEY),
      'import.meta.env.VITE_GEMINI_PROXY_URL': JSON.stringify(env.VITE_GEMINI_PROXY_URL),
      // Only inject Gemini API key in development mode for localhost testing
      // In production, this will be undefined and force use of the proxy
      'process.env.API_KEY': mode === 'development' ? JSON.stringify(env.GEMINI_API_KEY) : 'undefined',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
