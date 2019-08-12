<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">唯一标识</div>
        <div slot="content">
          <dao-input
            v-model="code"
            icon-inside
            type="text"
            name="code"
            data-vv-as="唯一标识"
            :message="veeErrors.first('code')"
            :status="veeErrors.has('code') ? 'error' : ''"
            v-validate="'required|alpha|max:10'">
          </dao-input>
        </div>
        <div slot="content-helper">
          创建之后不能修改
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">配额字段名</div>
        <div slot="content">
          <dao-input
            v-model="name"
            icon-inside
            type="text"
            name="name"
            v-validate="'required|max:10'"
            data-vv-as="配额字段名"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">配额字段单位</div>
        <div slot="content">
          <dao-input
            v-model="unit"
            icon-inside
            type="text"
            name="unit"
            data-vv-as="配额字段单位"
            v-validate="'required|max:10'"
            :message="veeErrors.first('unit')"
            :status="veeErrors.has('unit') ? 'error' : ''">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">描述</div>
        <div slot="content">
          <dao-input
            icon-inside
            v-model="description"
            name="description"
            data-vv-as="描述"
            v-validate="'max:255'"
            :message="veeErrors.first('description')"
            :status="veeErrors.has('description') ? 'error' : ''">
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
  name: 'CreateQuotaFieldDialog',
  extends: dialog('创建配额字段'),
  data() {
    return {
      code: '',
      name: '',
      unit: '',
      description: '',
    };
  },
  computed: {
    isValidForm() {
      return this.code !== '' &&
        this.name !== '' &&
        this.unit !== '' &&
        !this.veeErrors.any();
    },
  },
  methods: {
    onConfirm() {
      const {
        code,
        name,
        unit,
        description,
      } = this;

      this.$emit('create', {
        code,
        name,
        unit,
        description,
      });
    },

    dialogWillClose() {
      this.code = '';
      this.name = '';
      this.unit = '';
      this.description = '';
    },
  },
};
</script>
