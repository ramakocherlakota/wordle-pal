const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/service',
    createProxyMiddleware({
      target: "https://kxk4tebf2oubdbadxazw5uuvma0dvfpe.lambda-url.us-east-1.on.aws/",
      changeOrigin: true
    })
  );
};
