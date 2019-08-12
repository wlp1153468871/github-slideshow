<template>
  <dao-dialog
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
    @dao-dialog-confirm="onConfirm">
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">规格名称</div>
        <div slot="content">
          <dao-input
            icon-inside
            name="name"
            v-model="vars.name"
            placeholder="规格名称"
            v-validate="'required|max:30'"
            :message="veeErrors.first('name')"
            :status="veeErrors.has('name') ? 'error' : ''"
            data-vv-as="规格名称">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">简短介绍</div>
        <div slot="content">
          <dao-input
            icon-inside
            name="description"
            v-model="vars.description"
            placeholder="选填，简短介绍"
            v-validate="'max:30'"
            :message="veeErrors.first('description')"
            :status="veeErrors.has('description') ? 'error' : ''"
            data-vv-as="简短介绍">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item>
        <div slot="label">规格备注</div>
        <div slot="content">
          <dao-input
            icon-inside
            name="custom_description"
            v-model="vars.custom_description"
            placeholder="选填，例如:经济型"
            v-validate="'max:30'"
            :message="veeErrors.first('custom_description')"
            :status="veeErrors.has('custom_description') ? 'error' : ''"
            data-vv-as="规格备注">
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <dao-setting-section>
      <dao-setting-item
        v-for="(require, index) in vars.requires"
        :key="index">
        <div slot="label">
          {{ index === 0 ? '配额要求' : '' }}
        </div>
        <div slot="content">
          <dao-input
            v-model="require.require"
            :name="`$${index}`"
            type="text"
            v-validate="'required|min_value:0'"
            icon-inside
            :message="veeErrors.first(`$${index}`)"
            :status="veeErrors.has(`$${index}`) ? 'error' : ''"
            :data-vv-as="require.name">
            <span slot="append">{{ require.unit }}</span>
          </dao-input>
          {{ require.name }}
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
import { cloneDeep, orderBy } from 'lodash';
import dialog from '@/view/mixins/dialog';

export default {
  name: 'EditPlanDialog',
  extends: dialog('编辑规格'),
  props: {
    plan: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      vars: {
        id: '', // itemid
        name: '',
        description: '',
        custom_description: '',
        // bullets: [],
        requires: [],
      },
    };
  },
  watch: {
    plan: {
      immediate: true,
      handler(plan) {
        this.initPlan(plan);
      },
    },
  },
  computed: {
    isValidForm() {
      return this.vars.name !== '' && !this.veeErrors.any();
    },
  },
  methods: {
    initPlan(plan) {
      const {
        id,
        name,
        description,
        custom_description,
      } = plan;

      const requires = orderBy(cloneDeep(plan.requires || []), 'name');
      this.vars = {
        id,
        name,
        description,
        custom_description,
        requires,
      };
    },

    onConfirm() {
      this.$emit('save', this.vars);
      this.onClose();
    },

    dialogWillClose() {
      this.initPlan(this.plan);
    },
  },
};
</script>
