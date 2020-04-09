<template>
  <dao-dialog
    class="apply-quota-dialog"
    :config="config"
    :visible.sync="isShow"
    @dao-dialog-close="onClose"
    @dao-dialog-cancel="onClose"
  >
    <div class="dao-setting-warning">
      <svg class="tip-icon icon"><use xlink:href="#icon_bell"></use></svg>
      提示: 只有修改了配额值，才能提交。
    </div>
    <dao-setting-section v-for="(q, index) in quotas" :key="q.code">
      <dao-setting-item>
        <div slot="label">{{ q.name }} 配额</div>
        <div slot="content">
          <dao-input
            icon-inside
            type="text"
            :name="q.id"
            :data-vv-as="q.name"
            v-model="items[index]"
            :unit="q.unit"
            placeholder="不填, 表示不限制"
            :message="veeErrors.first(q.id)"
            :status="veeErrors.has(q.id) ? 'error' : ''"
            v-validate="'decimal:3|max:12|min_value:0|max_value:999999'"
          >
            <span v-if="q.unit" slot="append">
              {{ q.unit }}
            </span>
          </dao-input>
        </div>
      </dao-setting-item>
    </dao-setting-section>
    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" :disabled="!isValidForm" @click="onConfirm()">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { isNil } from 'lodash';
import { convert } from '@/core/utils';
import { PLANKEY } from '@/core/constants/constants';
import dialog from '@/view/mixins/dialog';
import { mapState } from 'vuex';

export default {
  name: 'ApplyQuotaDialog',

  extends: dialog('申请配额'),

  props: {
    quotas: { type: Array, default: () => [] },
  },

  data() {
    return {
      items: [],
    };
  },

  computed: {
    ...mapState(['quotaDict']),
    isValidForm() {
      return (
        !this.veeErrors.any() &&
        !this.quotas.every(this.compareQuota) &&
        this.items.some(item => item)
      );
    },
  },

  watch: {
    quotas: {
      deep: true,
      immediate: true,
      handler() {
        this.initItems();
      },
    },
  },

  methods: {
    initItems() {
      this.items = this.quotas.map(x => {
        return isNil(x.limit) ? '' : String(x.limit);
      });
    },

    onConfirm() {
      const { MEMORY } = PLANKEY;
      const quotas = [];
      this.quotas.forEach((quota, index) => {
        if (!this.compareQuota(quota, index) && this.items[index] !== '') {
          let maxQuota = Number(this.items[index]);
          if (quota.code === MEMORY) {
            maxQuota = convert(maxQuota, 'MB', this.quotaDict[MEMORY].unit);
          }
          quotas.push({
            quota_field_id: quota.id,
            max_quota: maxQuota,
          });
        }
      });
      this.$emit('on-change', quotas);
      this.onClose();
    },

    compareQuota(quota, index) {
      return isNil(quota.limit) && this.items[index] === '';
    },

    dialogWillClose() {
      this.initItems();
    },
  },
};
</script>

<style lang="scss">
// global-css
.apply-quota-dialog {
  .dao-dialog-body {
    max-height: 500px;
  }
}
</style>
