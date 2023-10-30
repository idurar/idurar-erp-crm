const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target:
        import.meta.env.REACT_APP_DEV_REMOTE == 'remote'
          ? import.meta.env.REACT_APP_BACKEND_SERVER
          : 'http://localhost/',
      changeOrigin: true,
    })
  );
};
