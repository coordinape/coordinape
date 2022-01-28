module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
};
