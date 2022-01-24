const webpack = require('webpack');
const SentryCliPlugin = require('@sentry/webpack-plugin');

const { VERCEL_GIT_COMMIT_SHA, SENTRY_PROJECT, SENTRY_AUTH_TOKEN } =
  process.env;

const shouldDryRun = !(SENTRY_PROJECT && SENTRY_AUTH_TOKEN);

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
          // Release will utilize the vercel-specified sha if available.
          // Otherise the current branch HEAD's sha will be used instead.
          // These are functionally the same, but its a small optimization
          // when running in CI, and ensures compatibility across all
          // integrations.
          release: VERCEL_GIT_COMMIT_SHA,
          // Dry run in development environments or if the Sentry Auth token
          // is absent. Simply logging a webpack warning will still cause
          // compilation to fail in CI, so we want to avoid that.
          dryRun: shouldDryRun,
          ignore: ['node_modules', 'craco.config.js'],
          org: 'coordinape',
          project: 'app',
        }),
      ],
    },
  },
};
