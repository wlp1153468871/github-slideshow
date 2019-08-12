<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">服务名</div>
        <div slot="content">
          <dao-input
            icon-inside
            v-model="name"
            placeholder="请输入服务名"
            name="name"
            type="text"
            v-validate="'required|max:20'"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            data-vv-as="服务名">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <button
        class="dao-btn blue"
        :disabled="!isValidForm"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddServicesetDialog',
  extends: dialog('创建服务'),
  data() {
    return {
      name: '',
    };
  },
  computed: {
    isValidForm() {
      return !this.veeErrors.any();
    },
  },
  methods: {
    onConfirm() {
      this.$emit('create', {
        name: this.name,
        description: '',
      });
      this.onClose();
    },

    dialogWillClose() {
      this.name = '';
    },
  },
};
</script>
