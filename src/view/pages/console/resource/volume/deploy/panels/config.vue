<template>
  <div class="route-config">
    <div class="container">
      <space-zone></space-zone>
      <dao-setting-layout>
        <template slot="layout-title">基本信息</template>
        <dao-setting-section>
          <dao-setting-item>
            <p slot="label">名称</p>
            <div slot="content">
              <dao-input
                icon-inside
                v-model="form.name"
                type="text"
                name="name"
                v-validate="{
                  required: true,
                  dns_1123_sub_domain: true,
                  max: nameValidation.maxlength
                }"
                :message="veeErrors.first('name')"
                :status="veeErrors.has('name') ? 'error' : ''"
                data-vv-as="存储名称">
              </dao-input>
            </div>
            <template slot="content-helper">
              {{ nameValidation.chinese }}
            </template>
          </dao-setting-item>
        </dao-setting-section>
      </dao-setting-layout>
      <dao-setting-layout>
        <template slot="layout-title">规格</template>
        <dao-setting-section>
          <dao-setting-item>
            <p slot="label">容量</p>
            <template slot="content">
              <div class="resource-size">
                <dao-input
                  icon-inside
                  v-model="form.storage"
                  type="text"
                  name="storage"
                  v-validate="{
                    required: true,
                    decimal: 5,
                    min_value: 0,
                    is_not: '0',
                  }"
                  :class="veeErrors.has('storage') ? 'error' : ''"
                  :status="veeErrors.has('storage') ? 'error' : ''"
                  :message="veeErrors.first('storage')"
                  data-vv-as="容量">
                </dao-input>
                <el-select
                  disabled
                  size="small"
                  style="width: 120px;"
                  v-model="form.unit">
                  <el-option-group
                    v-for="group in units"
                    :key="group.label"
                    :label="group.label">
                    <el-option
                      v-for="item in group.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-option-group>
                </el-select>
              </div>
            </template>
          </dao-setting-item>
        </dao-setting-section>
        <dao-setting-section>
          <dao-setting-item>
            <p slot="label">读写模式</p>
            <template slot="content">
              <dao-radio-group class="radio-group-row">
                <dao-radio
                  v-for="mode in ACCESS_MODE"
                  v-model="form.accessModes"
                  :key="mode.key"
                  :label="mode.key">
                  {{ mode.description }}
                </dao-radio>
              </dao-radio-group>
            </template>
          </dao-setting-item>
        </dao-setting-section>
      </dao-setting-layout>
    </div>
  </div>
</template>

<script>
import {
  ACCESS_MODE,
  DNS1123_SUBDOMAIN_VALIDATION,
} from '@/core/constants/resource';
import SpaceZone from '@/view/components/space-zone/space-zone';

export default {
  name: 'ConfigPanel',

  components: {
    SpaceZone,
  },

  props: {
    value: { type: Object, default: () => ({}) },
  },

  data() {
    return {
      ACCESS_MODE,
      form: {
        name: '',
        storage: 1,
        unit: 'G',
        accessModes: 'ReadWriteMany',
      },
      nameValidation: DNS1123_SUBDOMAIN_VALIDATION,
      units: [
        {
          label: 'Binary Units',
          options: [
            {
              value: 'Mi',
              label: 'MiB',
            },
            {
              value: 'Gi',
              label: 'GiB',
            },
            {
              value: 'Ti',
              label: 'TiB',
            },
          ],
        },
        {
          label: 'Decimal Units',
          options: [
            {
              value: 'M',
              label: 'MB',
            },
            {
              value: 'G',
              label: 'GB',
            },
            {
              value: 'T',
              label: 'TB',
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.route-config {
  .radio-group-row {
    &.dao-radio-group:before,
    &.dao-radio-group:after {
      content: unset;
    }
  }

  .resource-size {
    display: flex;
  }
}
</style>
