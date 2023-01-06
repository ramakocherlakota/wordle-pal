const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/service',
    createProxyMiddleware({
      target: "https://udt3bpqfayfa4jmdpi2jeqfs4m0gckeg.lambda-url.us-east-1.on.aws/",
      changeOrigin: true
    })
  );
};
