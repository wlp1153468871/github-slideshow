<template>
  <div class="property-dialog">
    <dao-dialog
      :size="size"
      :config="config"
      :visible.sync="isShow"
      :container-class="containerClass"
      @opened="onOpened"
      @before-close="onBeforeClose"
      @closed="onClosed">
      <slot></slot>
      <div slot="footer" class="property-dialog-footer">
        <div class="error-message" @click="goToErrorTab">
          {{ status.message }}
        </div>
        <div>
          <slot name="footer">
            <button class="dao-btn ghost" @click="onCancel">取消</button>
            <save-button
              class="dao-btn blue"
              @click="onConfirm"
              :saving="isSaving">
              确定
            </save-button>
          </slot>
        </div>
      </div>
    </dao-dialog>
  </div>
</template>

<script>
import dialog from '@/view/mixins/dialog';

export default {
  name: 'DaoPropertyDialog',
  extends: dialog(),
  props: {
    status: { type: Object, default: () => ({}) },
    title: { type: String, default: '' },
    isSaving: { type: Boolean, default: false },
    size: { type: String, default: 'lg' },
  },
  computed: {
    containerClass() {
      return `property-dialog ${this.status.type}`;
    },
  },
  watch: {
    title: {
      immediate: true,
      handler(title) {
        this.setDialogTitle(title);
      },
    },
  },
  methods: {
    onConfirm() {
      this.$emit('confirm');
    },
    goToErrorTab() {
      this.$emit('update:currentTab', this.status.tab);
    },
  },
};
</script>

<style lang='scss'>
@import "~daoColor";
$error-color: generate-color($red, -3);

.property-dialog {
  transition: opacity 0s;
  .dao-tab .dao-tab__header {
    padding: 0;
    background-color: $white-light;
    .dao-tab-nav-item.active {
      padding-top: 10px;
      color: $black-dark;
      border-top: 1px solid $white-dark;
    }
    .dao-tab-nav .dao-tab-nav-item {
      padding: 6.5px 15px;
      font-size: 13px;
    }
  }
  .dao-dialog-header {
    background-image: none;
    box-shadow: none;
  }
  &.error {
    .dao-dialog-footer {
      border-top: none;
      .error-message {
        display: block;
        cursor: pointer;
      }
    }
  }
  &-footer {
    .error-message {
      display: none;
      padding: 6px 10px;
      color: $red;
      text-align: left;
      background-color: $error-color;
      box-shadow: inset 0 -1px 0 0 #f0c2c0, inset 0 1px 0 0 #f0c2c0;
    }
  }
}
</style>
