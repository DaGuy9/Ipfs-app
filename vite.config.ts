import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { Server } from 'http';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    basicSsl(),
  ],
  build: {
    outDir: 'dist', // Directory to store the build output
    sourcemap: true, // Generate source maps for debugging
  },
  server: {
    port: 3000, // Local development server port
    https: true,// Enable HTTPS if necessary
    host: '0.0.0.0'
  },
});