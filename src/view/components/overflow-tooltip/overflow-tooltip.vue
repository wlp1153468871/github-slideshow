<template>
  <span class="overflow-tooltip" ref="container">
    <el-tooltip v-if="overflow" :content="text" :placement="placement">
      <span class="content">
        {{ text }}
      </span>
    </el-tooltip>
    <span class="content" v-else>
      {{ text }}
    </span>
  </span>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'overflow-tooltip',

  props: {
    text: { type: String },
    placement: { type: String, default: 'right' },
  },

  data() {
    return {
      contentWidth: 0,
      containerWidth: 0,
    };
  },

  computed: {
    ...mapState(['isCollapse']),

    overflow() {
      return this.contentWidth >= this.containerWidth;
    },
  },

  mounted() {
    const fontSize = '14px';
    const fakeTextNode = document.createElement('div');
    fakeTextNode.classList.add('width-calculator');
    fakeTextNode.style.fontSize = fontSize;
    fakeTextNode.innerText = this.text;
    document.body.append(fakeTextNode);
    this.contentWidth = fakeTextNode.clientWidth + 1;
    fakeTextNode.remove();
    this.containerWidth = this.$refs.container.clientWidth;
  },
};
</script>

<style lang="scss">
.overflow-tooltip {
  display: inline-block;
  width: 100%;

  .content {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: middle;
  }

  .width-calculator {
    position: fixed;
    visibility: hidden;
    height: auto;
    width: auto;
    white-space: nowrap;
  }
}
</style>
