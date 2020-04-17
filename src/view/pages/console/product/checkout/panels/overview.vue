<template>
  <div class="container">
    <dao-setting-layout v-if="!isEmpty(formModel)">
      <template slot="layout-title">确认订购</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">{{ this.tenantDescription }}</div>
          <div slot="content">{{ org.name }} / {{ space.name }}</div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">{{ this.zoneDescription }}</div>
          <div slot="content">{{ zone.area_name }} / {{ zone.env_name }}</div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">服务类型</div>
          <div slot="content">{{ serviceName }}</div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section v-if="formModel">
        <dao-setting-item>
          <div slot="label">参数</div>
          <div slot="content">
            <pre>{{ stringifiedParameters }}</pre>
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <!-- <dao-setting-section v-if="planDetail">
        <dao-setting-item>
          <div slot="label">规格</div>
          <div slot="content">{{ planDetail }}</div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section v-for="item in formModel.parameters" :key="item.id">
        <dao-setting-item>
          <div slot="label">{{ item.name }}</div>
          <div slot="content">{{ item.value | otherwise }}</div>
        </dao-setting-item>
      </dao-setting-section> -->
    </dao-setting-layout>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { isEmpty } from 'lodash';
import { PLANKEY, DICTIONARY } from '@/core/constants/constants';
import { convert } from '@/core/utils';

export default {
  name: 'OverviewPanel',

  props: {
    serviceName: { type: String, default: '' },
    formModel: { type: Object, default: () => ({}) },
    purchasing: { type: Boolean, default: false },
  },

  methods: {
    isEmpty,
    groupConfig(item, unit) {
      const { quotaDict } = this;
      const { CPU, MEMORY } = PLANKEY;
      return `${item[CPU] / 1000}${quotaDict[CPU].unit} ${convert(
        item[MEMORY],
        quotaDict[MEMORY].unit,
        unit[MEMORY],
      )}${quotaDict[MEMORY].unit}`;
    },
  },

  computed: {
    ...mapState(['space', 'org', 'zone']),
    ...mapGetters(['tenantDescription', 'zoneDescription']),

    quotaDict() {
      return this.formModel.quotaDict;
    },

    stringifiedParameters() {
      return JSON.stringify(this.formModel.parameters, null, 2);
    },

    planDetail() {
      if (!this.formModel.plan) return '';
      if (this.formModel.symbol) {
        const { plan } = this.formModel;
        const { standard } = this.formModel;
        const planDetails = [];
        Object.entries(plan).forEach(([key, value]) => {
          const quotaDict = this.quotaDict[key];
          if (PLANKEY.CONFIG === key) {
            planDetails.push(`${DICTIONARY[key]}：${this.groupConfig(value, standard[key].unit)}`);
          } else {
            planDetails.push(`${quotaDict.name}：${value}${quotaDict.unit}`);
          }
        });
        return planDetails.join('，');
      }
      return this.formModel.plan.description;
    },
  },
};
</script>
