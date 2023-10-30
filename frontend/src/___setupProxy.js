import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target:
        import.meta.env.VITE_DEV_REMOTE == 'remote'
          ? import.meta.env.VITE_BACKEND_SERVER
          : 'http://localhost/',
      changeOrigin: true,
    })
  );
}
