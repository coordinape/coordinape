module.exports = {
  stories: [
    {
      directory: '../src/ui',
      titlePrefix: 'Design System/Components/',
      files: '**/*.stories.*',
    },
    {
      directory: '../src/pages',
      titlePrefix: 'Design System/Pages/',
      files: '**/*.stories.*',
    },
  ],
  core: {
    builder: 'webpack5',
  },
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-designs',
    '@storybook/preset-create-react-app',
  ],
  staticDirs: ['../public'],
};
