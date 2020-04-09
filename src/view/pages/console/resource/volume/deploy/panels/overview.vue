<template>
  <div class="container">
    <dao-setting-layout v-if="!isEmpty(formModel)">
      <template slot="layout-title">确认订购</template>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">项目信息</div>
          <div slot="content">租户：{{ org.name }}，项目：{{ space.name }}</div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">区域 / 环境</div>
          <div slot="content">{{ zone.area_name }} / {{ zone.env_name }}</div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">名称</div>
          <div slot="content">{{ formModel.metadata.name }}</div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">容量</div>
          <div slot="content">
            {{ formModel.spec.resources.requests.storage | usage_with_units('storage') }}
          </div>
        </dao-setting-item>
      </dao-setting-section>
      <dao-setting-section>
        <dao-setting-item>
          <div slot="label">读写模式</div>
          <div slot="content">{{ [formModel.spec.accessMode] | access_modes }}</div>
        </dao-setting-item>
      </dao-setting-section>
    </dao-setting-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { isEmpty } from 'lodash';

export default {
  name: 'OverviewPanel',

  props: {
    formModel: { type: Object, default: () => ({}) },
  },

  methods: {
    isEmpty,
  },

  computed: {
    ...mapState(['space', 'org', 'zone']),
  },
};
</script>
