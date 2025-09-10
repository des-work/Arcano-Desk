const path = require('path');

module.exports = function override(config, env) {
  // Add minimal polyfills for PDF.js
  config.resolve.fallback = {
    ...config.resolve.fallback,
    fs: false,
    http: false,
    https: false,
    url: false,
    util: false,
    stream: false,
    crypto: false,
    os: false,
    path: false,
    buffer: require.resolve('buffer'),
    assert: false,
  };

  // Add buffer to webpack's provide plugin
  config.plugins.push(
    new config.webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return config;
};
