<template>
  <div class="marked-body" v-html="markdownHtml"></div>
</template>

<script>
let marked = null;
export default {
  name: 'Marked',

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
      //  立即执行handle方法
      immediate: true,
      handler(text) {
        if (text) {
          this.getMarked().then(() => {
            this.markdownHtml = marked(text);
          });
        } else {
          this.getMarked().then(() => {
            this.markdownHtml = marked('空');
          });
        }
      },
    },
  },

  methods: {
    getMarked() {
      if (marked) {
        return Promise.resolve(marked);
      }
      return Promise.all([
        import(/* webpackChunkName: "marked" */ /* webpackMode: "lazy" */ 'marked'),
        import(/* webpackChunkName: "highlight.js" */ /* webpackMode: "lazy" */ 'highlight.js'),
        import(/* webpackChunkName: "github-markdown-css" */ /* webpackMode: "lazy" */ 'github-markdown-css'),
      ]).then(res => {
        marked = res[0].default;
        const hljs = res[1].default;
        marked.setOptions({
          renderer: new marked.Renderer(),
          highlight: code => {
            return hljs.highlightAuto(code).value;
          },
          pedantic: false,
          gfm: true,
          breaks: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
          xhtml: false,
        });
        return marked;
      });
    },
  },
};
</script>

<style lang="scss">
  .marked-body {
    padding: 0 20px 20px 0;
    h1 {
      color: #3d444f;
    }
    h2 {
      color: #3d444f;
    }
    h3 {
      color: #3d444f;
    }
    p {
      color: #595f69;
    }
    table
    {
      border-collapse: collapse;
      margin: 0 auto;
      text-align: center;
      width: 100%;
    }
    table td, table th
    {
      border: 1px solid  #E4E7ED;
      color: #666;
      height: 30px;
    }
    table thead th
    {
      background-color: #F5F7FA;
      width: 80px;
    }
    table tr:nth-child(odd)
    {
      background: #fff;
    }
    table tr:nth-child(even)
    {
      background: #F1F7FE;
    }
    pre code {
      white-space: pre;
      overflow: hidden;  /*超出部分隐藏*/
      white-space: break-spaces;
      text-overflow: ellipsis;
    }
    pre {
      background: rgb(248,248,248);
    }
  }
</style>
