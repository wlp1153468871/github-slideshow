<template>
  <div class="marked-body" v-html="markdownHtml"></div>
</template>

<script>
import marked from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

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

  // watch: {
  //   text: {
  //     handler(text) {
  //       this.getMarked(text);
  //     },
  //   },
  // },
  created() {
    this.getMarked(this.text);
  },

  methods: {
    getMarked(text) {
      if (text) {
        this.markdownHtml = marked(text);
      } else {
        this.markdownHtml = marked('空');
      }
    },
  },
};
</script>

<style lang="scss">
  .marked-body {
    /* padding: 20px; */
    padding-bottom: 20px;
    padding-right: 20px;
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
