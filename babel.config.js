module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          src: './src',
          '@assets': './src/assets',
          '@components': './src/components',
          '@screens': './src/screens',
        },
      },
    ],
    ['babel-plugin-styled-components'],
    ['react-native-worklets-core/plugin'],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__detectObjects'],
      },
    ],
  ],
};
