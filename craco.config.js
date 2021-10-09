module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [{
          test: /\.m?js/,
          resolve: {
            fullySpecified: false
          }
        }]
      },
      resolve: {
        fallback: {
          os: require.resolve('os-browserify'),
          crypto: require.resolve('crypto-browserify'),
          http: require.resolve('http-browserify'),
          https: require.resolve('https-browserify'),
          stream: require.resolve('stream-browserify'),
          util: require.resolve('util/'),
          assert: require.resolve('assert/')
        }
      }
    }
  }
};
