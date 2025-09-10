const path = require('path');
const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add polyfills for Node.js core modules
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
    path: require.resolve('path-browserify'),
    buffer: require.resolve('buffer'),
    assert: require.resolve('assert'),
  };

  // Add buffer to webpack's provide plugin
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    })
  );

  return config;
};
