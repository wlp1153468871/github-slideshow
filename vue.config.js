const path = require('path');

function resolve(dir) {
  return path.join(__dirname, '', dir);
}

module.exports = {
  parallel: false,
  productionSourceMap: false,
  pages: {
    app: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },

  css: {
    loaderOptions: {
      sass: {
        // 向全局sass样式传入共享的全局变量
        data: '@import "@/assets/styles/variables.scss";',
      },
    },
  },

  chainWebpack: config => {
    config.resolve.alias.set(
      'daoColor$',
      resolve('node_modules/dao-style-vue/styles/dao-color.scss'),
    );
    const svgRule = config.module.rule('svg');
    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    svgRule.uses.clear();
    // add replacement loader(s)
    svgRule
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]',
      });

    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({
        inline: true,
        name: 'worker.[hash].js',
      })
      .end();
  },

  devServer: {
    port: 4200,
    proxy: {
      '/v1': {
        target: process.env.VUE_APP_API_URL,
        ws: false,
        changeOrigin: true,
      },
      '/app-server': {
        target: process.env.VUE_APP_API_URL,
        ws: true,
        changeOrigin: true,
      },
    },
  },
  //  DX配置
  configureWebpack: {
    externals: {
      DxHeader: 'DxHeader'
    }
  },
};
