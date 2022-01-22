const webpack = require('webpack');
const SentryCliPlugin = require('@sentry/webpack-plugin');

module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
      ignoreWarnings: [/Failed to parse source map/],
      resolve: {
        fallback: {
          os: require.resolve('os-browserify'),
          crypto: require.resolve('crypto-browserify'),
          http: require.resolve('http-browserify'),
          https: require.resolve('https-browserify'),
          stream: require.resolve('stream-browserify'),
          util: require.resolve('util/'),
          assert: require.resolve('assert/'),
          buffer: require.resolve('buffer/'),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
        new SentryCliPlugin({
          include: 'build',
          release: process.env.VERCEL_GIT_COMMIT_SHA,
          dryRun: process.env.VERCEL_GIT_COMMIT_SHA ? false : true,
          ignore: ['node_modules', 'craco.config.js'],
          org: 'kevin-siegler',
          project: 'coordinape',
        }),
      ],
    },
  },
};
