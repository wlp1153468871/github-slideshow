<template>
  <dao-dialog header="确认配额" :visible.sync="isShow" @closed="onClosed">
    <div class="dao-setting-warning">
      <svg class="tip-icon icon">
        <use xlink:href="#icon_bell"></use>
      </svg>
      提示: 您可以对申请的配额进行调整。
    </div>
    <dao-setting-section v-for="q in quota_extend_items" :key="q.name">
      <dao-setting-item>
        <div slot="label">{{ q.quota_field.name }}</div>
        <div slot="content" class="quota-content">
          <div class="used-quota">
            <p>当前配额使用情况</p>
            <div class="quota-progress-item">
              {{ q.in_use }} {{ q.quota_field.unit }}
              <span v-if="q.rate >= 1">0%</span>
              <span v-else>{{ q.rate | percent }}</span>
              <dao-progress class="quota-progress" type="usage" :progress="q.rate > 1 ? 0 : q.rate">
              </dao-progress>
              {{ q.in_use }}/{{ q.limit | otherwise('不限额度') }} {{ q.quota_field.unit }}
            </div>
          </div>
          <div class="apply-quota">
            <p>申请配额</p>
            <dao-input type="text" v-model="q.value">
              <span slot="append">{{ q.quota_field.unit }}</span>
            </dao-input>
          </div>
        </div>
      </dao-setting-item>
    </dao-setting-section>

    <div slot="footer">
      <button class="dao-btn ghost" @click="onClose">
        取消
      </button>
      <button class="dao-btn blue" :disabled="isConfirming" @click="onConfirm">
        确定
      </button>
    </div>
  </dao-dialog>
</template>

<script>
import { mapState } from 'vuex';
import { isFinite } from 'lodash';
import { convert } from '@/core/utils';
import { PLANKEY } from '@/core/constants/constants';

export default {
  name: 'EditQuotaDialog',

  props: {
    visible: Boolean,
    isConfirming: Boolean,
    request: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      quotas: [],
      quota_extend_items: [],
    };
  },

  computed: {
    ...mapState(['quotaDict']),

    isShow: {
      set(val) {
        this.$emit('close', val);
      },
      get() {
        return this.visible;
      },
    },
  },

  watch: {
    request: {
      immediate: true,
      handler() {
        this.initQuotaExtendItems();
      },
    },
  },

  methods: {
    onClose() {
      this.$emit('close');
    },

    initQuotaExtendItems() {
      const { MEMORY } = PLANKEY;
      const { quota_extend_items = [] } = this.request;
      this.quota_extend_items = quota_extend_items.map(x => {
        let value = x.max_quota || 0; // add or reset value;
        let { in_use, limit } = x;
        if (x.quota_field.code === MEMORY) {
          value = convert(value, this.quotaDict[MEMORY].unit);
          in_use = convert(in_use, this.quotaDict[MEMORY].unit);
          limit = convert(limit, this.quotaDict[MEMORY].unit);
        }
        return {
          ...x,
          value,
          in_use,
          limit,
          rate: this.getQuotaRate(x),
          message: '',
        };
      });
    },

    onConfirm() {
      const { MEMORY } = PLANKEY;
      const spaceId = this.request.space_id;
      const approvalId = this.request.approval_id;
      const data = {
        process_status: 'finish',
        quota_extend_items: this.quota_extend_items
          .filter(item => item.value !== '')
          .map(quota => {
            let maxQuota = Number(quota.value);
            let usedQuota = quota.in_use;
            if (quota.quota_field.code === MEMORY) {
              maxQuota = convert(maxQuota, 'M', this.quotaDict[MEMORY].unit);
              usedQuota = convert(usedQuota, 'M', this.quotaDict[MEMORY].unit);
            }
            return {
              ...quota,
              max_quota: maxQuota,
              in_use: usedQuota,
              quota_field_id: quota.quota_field_id,
            };
          }),
      };
      this.$emit('apply', {
        spaceId,
        approvalId,
        data,
      });
    },

    getQuotaRate(quota) {
      const rate = quota.in_use / quota.limit;
      return isFinite(rate) ? rate : null;
    },

    onClosed() {
      this.initQuotaExtendItems();
    },
  },
};
</script>
