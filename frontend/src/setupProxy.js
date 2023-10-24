const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target:
        process.env.REACT_APP_DEV_REMOTE == 'remote'
          ? process.env.REACT_APP_PROXY_SERVER
          : 'http://localhost/',
      changeOrigin: true,
    })
  );
};
