import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
  const env = loadEnv(mode, currentDirectory);

  const proxy_url =
    env.VITE_DEV_REMOTE === 'remote'
      ? env.VITE_BACKEND_SERVER
      : 'http://localhost:8888/';

  const config = {
    plugins: [react()],
    resolve: {
      base: '/',
      alias: {
        '@': path.resolve(currentDirectory, 'src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: proxy_url,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
  return defineConfig(config);
};
