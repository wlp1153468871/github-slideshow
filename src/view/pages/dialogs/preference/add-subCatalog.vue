<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm"
  >
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">二级分类名</div>
        <div slot="content">
          <dao-input
            icon-inside
            v-model="name"
            name="name"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            v-validate="'required|max:8'"
            data-vv-as="二级分类名"
          >
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" :disabled="!isValidForm" @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddSubCatalogDialog',
  extends: dialog('添加二级分类'),
  data() {
    return {
      name: '',
    };
  },
  computed: {
    isValidForm() {
      return !this.veeErrors.any() && this.name.trim() !== '';
    },
  },
  methods: {
    onConfirm() {
      const catalog = {
        name: this.name,
        services: [],
      };
      this.$emit('create', catalog);
      this.onClose();
    },

    dialogWillClose() {
      this.name = '';
    },
  },
};
</script>
