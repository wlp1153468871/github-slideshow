<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">名称</div>
        <div slot="content">
          <dao-input
            type="text"
            v-model="name">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">单位</div>
        <div slot="content">
          <dao-input v-model="unit">
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
        :disabled="!formValidation"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddQuotaDialog',
  extends: dialog('添加配额种类'),
  data() {
    return {
      name: '',
      unit: '',
    };
  },
  computed: {
    formValidation() {
      return this.name.trim() !== '' &&
        this.unit.trim() !== '';
    },
  },
  methods: {
    onConfirm() {
      const quota = {
        name: this.name,
        unit: this.unit,
      };
      this.$emit('create', quota);
      this.onClose();
    },

    dialogWillClose() {
      this.name = '';
      this.unit = '';
    },
  },
};
</script>
