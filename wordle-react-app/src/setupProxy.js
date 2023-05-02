const { createProxyMiddleware } = require('http-proxy-middleware');

// pointing to wordle-pal-local service
module.exports = function(app) {
  app.use(
    '/service',
    createProxyMiddleware({
      target: "https://3a4sqenzhvr7ytnxakcsjeeh5u0hbynu.lambda-url.us-east-1.on.aws/",
      changeOrigin: true
    })
  );
};
