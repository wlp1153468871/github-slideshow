<template>
  <div style="display: inline-block; width: 100%;" ref="container">
    <el-tooltip
      v-if="overflow"
      :content="text"
      placement="right">
      <span class="menu-content">
        {{ text }}
      </span>
    </el-tooltip>
    <span class="menu-content" v-else>
      {{ text }}
    </span>
  </div>

</template>

<script>
export default {
  name: 'overflow-tooltip',

  props: {
    text: { type: String },
  },

  data() {
    return {
      width: 0,
    };
  },

  computed: {
    overflow() {
      return this.width > 115;
    },
  },

  mounted() {
    const fontSize = '14px';
    const fakeTextNode = document.createElement('div');
    fakeTextNode.classList.add('width-calculator');
    fakeTextNode.style.fontSize = fontSize;
    fakeTextNode.innerText = this.text;
    document.body.append(fakeTextNode);
    this.width = fakeTextNode.clientWidth;
    fakeTextNode.remove();
  },
};
</script>

<style lang="scss">
.menu-content {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.width-calculator {
  position: fixed;
  visibility: hidden;
  height: auto;
  width: auto;
  white-space: nowrap;
}
</style>
