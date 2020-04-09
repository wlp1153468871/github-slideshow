<template>
  <div style="display: inline-block; width: 100%;" ref="container">
    <el-tooltip v-if="!isCollapse && overflow" :content="text" placement="right">
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
import { mapState } from 'vuex';

export default {
  name: 'overflow-tooltip',

  props: {
    text: { type: String },
  },

  data() {
    return {
      contentWidth: 0,
      containerWidth: 0,
      unwatch: () => {},
    };
  },

  computed: {
    ...mapState(['isCollapse']),

    overflow() {
      return this.contentWidth > this.containerWidth;
    },
  },

  mounted() {
    const fontSize = '14px';
    const fakeTextNode = document.createElement('div');
    fakeTextNode.classList.add('width-calculator');
    fakeTextNode.style.fontSize = fontSize;
    fakeTextNode.innerText = this.text;
    document.body.append(fakeTextNode);
    this.contentWidth = fakeTextNode.clientWidth;
    fakeTextNode.remove();
    this.unwatch = this.$store.watch(
      () => this.$store.state.openedMenus,
      menus => {
        if (menus.indexOf('resource') > -1) {
          this.containerWidth = this.$refs.container.clientWidth;
        }
      },
    );
  },

  destroyed() {
    this.unwatch();
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
