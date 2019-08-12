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
            type="text"
            icon-inside
            name="name"
            v-model="name"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            v-validate="'required|max:25'"
            data-vv-as="服务名">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">类型</div>
        <div slot="content">
          <p style="margin-bottom: 10px">服务创建之后无法修改类型</p>
          <dao-radio-group type="block">
            <dao-radio
              v-for="(item, index) in SERVICE_TYPES"
              v-model="type"
              :key="index"
              :label="item.value"
              :headline="item.text"
              :disabled="item.disabled"
              :description="item.desc">
            </dao-radio>
          </dao-radio-group>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button
        class="dao-btn ghost"
        @click="onClose">
        取消
      </button>
      <save-button
        class="blue"
        text="确定"
        :disabled="formInvalidate"
        :loading="loading"
        @click="onConfirm">
      </save-button>
    </div>
  </dao-dialog>
</template>

<script>
import dialog from '@/view/mixins/dialog';
import { SERVICE_TYPES_DESC } from '@/core/constants/constants';

export default {
  name: 'AddServiceDialog',
  extends: dialog('添加服务'),
  props: {
    loading: { type: Boolean, default: false },
  },
  created() {
    this.init();
  },
  data() {
    return {
      SERVICE_TYPES: SERVICE_TYPES_DESC,
      name: '',
      description: '',
      type: '',
    };
  },
  computed: {
    formInvalidate() {
      return this.name === '' || this.veeErrors.any();
    },
  },
  methods: {
    init() {
      this.name = '';
      this.description = '';
      this.type = SERVICE_TYPES_DESC[0].value;
    },

    onConfirm() {
      // saving on parent component
      const {
        name,
        description,
        type,
      } = this;

      this.$emit('create', {
        name,
        description,
        type,
      });
      // this.onClose();
    },

    dialogWillClose() {
      this.init();
    },
  },
};
</script>
