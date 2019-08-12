module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-warn-cleaner': {
      ignoreFiles: ['**/node_modules/**/*', '**/bower_components/**/*'],
    },
  },
};
