module.exports = {
  stories: ['../src/**/*.stories.[tj]s', '../src/**/*.stories.[tj]sx'],
  core: {
    builder: 'webpack5',
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-designs',
    '@storybook/preset-create-react-app',
  ],
};
