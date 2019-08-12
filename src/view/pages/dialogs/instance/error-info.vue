<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose">
    <dao-copy-block class="copy-error-info__dialog">
      {{ text }}
    </dao-copy-block>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';

export default {
  name: 'ErrorInfoDialog',
  extends: dialog('错误信息'),
  props: {
    text: { type: String, default: '' },
  },
};
</script>

<style lang="scss">
.copy-error-info__dialog {
  margin: 20px;
  background-color: #ffffff;
  border: none;
  position: relative;

  pre {
    padding: 15px;
    background-color: #F5F7FA;
    width: 100%;
  }

  .copy-button {
    position: absolute;
    padding-right: 0;
    right: 4px;
    top: 8px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
}
</style>
