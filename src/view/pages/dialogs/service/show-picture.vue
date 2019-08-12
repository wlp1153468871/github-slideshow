<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose">
    <div>
      <div
        class="show-picture"
        v-bg-image="pic">
      </div>
    </div>
    <div slot="footer">
      <button class="dao-btn" @click="onClose">关闭</button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';

export default {
  name: 'ShowPictureDialog',
  extends: dialog('查看大图', {
    closeOnClickOutside: false,
    showFooter: true,
  }),
  props: {
    pic: { type: String, default: '' },
  },
};
</script>

<style lang="scss" scoped>
.show-picture {
  min-height: 500px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
}
</style>
