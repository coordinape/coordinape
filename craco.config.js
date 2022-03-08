const webpack = require('webpack');
const SentryCliPlugin = require('@sentry/webpack-plugin');

const {
  SENTRY_AUTH_TOKEN,
  VERCEL,
  VERCEL_ENV,
  VERCEL_GIT_COMMIT_SHA,
  VERCEL_URL,
} = process.env;

const shouldDryRun = !(
  VERCEL &&
  SENTRY_AUTH_TOKEN &&
  VERCEL_ENV !== 'development'
);

module.exports = {
  jest: {
    configure: {
      collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
      coverageReporters: ['json', 'lcov', 'text-summary'],
      transform: {
        '.(ts|tsx)': 'ts-jest',
      },
      globals: {
        'ts-jest': {
          compiler: 'ttypescript',
        },
      },
      setupFiles: ['<rootDir>/src/utils/test-setup.ts'],
    },
  },
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
          // include the transpiled js and sourcemaps
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
          deploy: {
            // Commits are auto-associated from the production Vercel environment
            // by the Sentry-GitHub integration. The token provided to Vercel
            // is not given the `org:read` permission necessary to
            // set commits.
            env: VERCEL_ENV,
            // Not sure where this shows up in the Sentry UI, but if we can
            // include it, why not?
            // Sentry complains without a protocol prefix, which Vercel does
            // not provide
            url: 'https://' + VERCEL_URL,
          },
        }),
      ],
    },
  },
};
