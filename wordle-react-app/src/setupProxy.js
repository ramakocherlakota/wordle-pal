const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/service',
    createProxyMiddleware({
      target: "https://mmsojeihglwc4nrgbkdz5yevge0tdskz.lambda-url.us-east-1.on.aws/",
      changeOrigin: true
    })
  );
};
