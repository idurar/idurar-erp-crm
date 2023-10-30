import path from 'path';

// import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
// export default ({ mode }) => {
//   process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
//   const config = {
//     plugins: [react()],
//     resolve: {
//       base: '/',
//       alias: {
//         '@': path.resolve(__dirname, 'src'),
//       },
//     },
//     server: {
//       proxy: {
//         '/api': {
//           target: 'http://dev-server.idurarapp.com/',
//           changeOrigin: false,
//           secure: false,
//         },
//       },
//     },
//   };
//   return defineConfig(config);
// };
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    base: '/',
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://dev-server.idurarapp.com/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
