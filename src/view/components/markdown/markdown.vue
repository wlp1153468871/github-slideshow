<template>
  <article @click="preventAnchor" class="markdown-body" v-html="markdownHtml"></article>
</template>

<script>
let converter = null;

export default {
  name: 'Markdown',
  props: {
    text: { type: String, default: '' },
  },
  data() {
    return {
      markdownHtml: '',
    };
  },
  watch: {
    text: {
      immediate: true,
      handler(text) {
        this.getConverter().then(() => {
          this.markdownHtml = converter.makeHtml(text);
        });
      },
    },
  },
  methods: {
    getConverter() {
      if (converter) {
        return Promise.resolve(converter);
      }
      // lazy load by webpack;
      // https://webpack.js.org/api/module-methods/#import-
      return Promise.all([
        import(/* webpackChunkName: "showdown" */ /* webpackMode: "lazy" */ 'showdown'),
        import(/* webpackChunkName: "showdown" */ /* webpackMode: "lazy" */ 'github-markdown-css'),
      ]).then(res => {
        const [showdown] = res;
        // inject module global
        converter = new showdown.Converter();
        return converter;
      });
    },
    preventAnchor(event) {
      if (event.type === 'click' && event.target.tagName.toUpperCase() === 'A') {
        event.preventDefault();
        event.stopPropagation();
        const { href } = event.target;
        window.open(href);
      }
    },
  },
};
</script>

<style lang="scss">
/**
 * using 3party markdown style
 * @link https://github.com/sindresorhus/github-markdown-css
 */
.markdown-body {
  h2 {
    color: #3d444f;
  }

  h3 {
    color: #3d444f;
  }

  p {
    color: #595f69;
  }
}
</style>
