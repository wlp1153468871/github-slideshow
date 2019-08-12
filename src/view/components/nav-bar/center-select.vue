<template>
  <div
    id="nav-bar-center-select"
    class="dao-select sm-select"
    v-click-outside:dao-select-dropdown="onCloseMenu">
    <!-- select -->
    <div :class="['dao-select-main', 'dao-select-rel']" @click="onClick">
      <div :class="['dao-select-switch', {'open': visible}]">
        <div class="dao-select-switch-text">
          <div v-if="org.name" class="selected-text">
            <span>{{ org.name }}</span>
          </div>
          <div v-else class="placeholder">
            {{ placeholder }}
          </div>
        </div>
        <div class="icon-box">
          <svg class="icon">
            <use xlink:href="#icon_caret-select"></use>
          </svg>
        </div>
      </div>
    </div>
    <!-- dropdown -->
    <div :class="['dao-select-popper', 'dao-select-dropdown']" v-show="visible">
      <div class="option-list">
        <center-select-option
          @click="onSelectItem(item)"
          v-for="(item, index) in orgs"
          :active="org.id === item.id"
          :key="index"
          :label="item.name"
          :value="item.id">
        </center-select-option>
      </div>
    </div>
  </div>
</template>

<script>
import CenterSelectOption from './center-select-option';

export default {
  name: 'CenterSelect',
  components: {
    CenterSelectOption,
  },
  props: {
    org: { type: Object, default: () => ({}) },
    orgs: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    onCloseMenu() {
      if (this.visible) {
        this.visible = false;
      }
    },

    onClick() {
      this.toggleMenu();
    },

    toggleMenu() {
      this.visible = !this.visible;
    },

    onSelectItem(item) {
      this.$emit('on-select', item);
      this.toggleMenu();
    },
  },
};
</script>

<style lang='scss'>
@import "~daoColor";

#nav-bar-center-select {
  width: 100%;
  height: auto;
  background: transparent;

  .dao-select-main {
    width: auto;
    vertical-align: middle;
  }
  .dao-select-switch {
    border: none;
    .selected-text {
      color: $grey-light;

      fill: $grey-light;
    }
  }
  .dao-select-switch-text {
    padding-right: 4px;
  }

  .dao-select-dropdown {
    left: 50%;
    transform: translateX(-50%);
  }

  .option-list {
    color: $black-dark;
    text-align: left;

    fill: $grey-light;

    .dao-option-item {
      word-break: keep-all;
    }
  }
}
</style>
