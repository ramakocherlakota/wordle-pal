const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/service',
    createProxyMiddleware({
      target: 'https://wordle-svc.ramakocherlakota.net',
      changeOrigin: true
    })
  );
};
