const { createProxyMiddleware } = require('http-proxy-middleware');

// using lcp (https://www.npmjs.com/package/local-cors-proxy) to avoid cors issues
// lcp --proxyUrl https://wordle-svc.ramakocherlakota.net

module.exports = function(app) {
  app.use(
    '/service',
    createProxyMiddleware({
      target: 'http://localhost:8010/proxy', 
      changeOrigin: true
    })
  );
};
