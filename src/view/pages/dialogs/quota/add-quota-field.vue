<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">唯一标识</div>
        <div slot="content">
          <dao-select
            v-model="fieldCode"
            placeholder="请输入种类的唯一标识"
            :with-search="true"
            search-placeholder="请输入种类的唯一标识"
            no-data-text="无选项"
            no-match-text="无匹配选项">
            <dao-option-group>
              <dao-option
                v-for="(option, index) in fields"
                :key="index"
                :value="option.code"
                :label="option.code">
              </dao-option>
            </dao-option-group>
          </dao-select>
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
        :disabled="!fieldCode"
        @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';

export default {
  name: 'AddUserDialog',
  extends: dialog('添加种类'),
  props: {
    fields: { type: Array, default: () => [] },
  },
  data() {
    return {
      fieldCode: '',
    };
  },
  methods: {
    onConfirm() {
      const field = this.fields.find(x => x.code === this.fieldCode);
      this.$emit('create', field);
      this.onClose();
    },

    // @overload
    dialogWillClose() {
      this.fieldCode = '';
    },
  },
};
</script>
